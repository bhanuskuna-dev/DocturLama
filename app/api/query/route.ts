import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { embed } from "@/lib/embedder";
import { similaritySearch } from "@/lib/vectorStore";
import { SourceCitation } from "@/lib/types";
import { expandQuery } from "@/lib/queryExpander";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); }

type HistoryMsg = { role: "user" | "assistant"; content: string };

const enc = new TextEncoder();
function sse(data: unknown): Uint8Array {
  return enc.encode(`data: ${JSON.stringify(data)}\n\n`);
}

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "X-Accel-Buffering": "no",
};

function singleEvent(data: unknown): Response {
  const stream = new ReadableStream({
    start(c) { c.enqueue(sse(data)); c.close(); },
  });
  return new Response(stream, { headers: SSE_HEADERS });
}

export async function POST(req: NextRequest) {
  const { question, topK = 3, history = [] } = await req.json() as {
    question: string;
    topK?: number;
    history?: HistoryMsg[];
  };

  if (!question) {
    return singleEvent({ t: "r", answer: "Question is required.", sources: [], confidence: 0 });
  }

  try {
    const expanded = expandQuery(question);
    const queryEmbedding = await embed(expanded);
    const chunks = similaritySearch(queryEmbedding, topK);

    if (chunks.length === 0) {
      return singleEvent({
        t: "r",
        answer: "No relevant documents found. Please upload medical documents first, then ask your question.",
        sources: [],
        confidence: 0,
      });
    }

    const contextBlock = chunks
      .map((c, i) => `[Source ${i + 1}] (${c.source}, chunk ${c.chunkIndex})\n${c.text}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are a clinical decision support assistant. Answer questions strictly based on the provided context.
Always cite sources using [Source N] notation. If the context does not contain sufficient information, say so explicitly.
At the end of your answer, provide a confidence score between 0.0 and 1.0 in the format: CONFIDENCE: 0.X
This score should reflect how well the context supports your answer.`;

    const userPrompt = `Context:\n${contextBlock}\n\nQuestion: ${question}\n\nProvide a precise clinical answer with source citations.`;

    const priorMessages: Anthropic.MessageParam[] = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const sources: SourceCitation[] = chunks.map((c, i) => ({
      label: `Source ${i + 1}`,
      text: c.text.slice(0, 200) + (c.text.length > 200 ? "…" : ""),
      source: c.source,
      chunkIndex: c.chunkIndex,
    }));

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = await getAnthropic().messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [...priorMessages, { role: "user", content: userPrompt }],
            stream: true,
          });

          let fullText = "";
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              const delta = event.delta.text;
              fullText += delta;
              controller.enqueue(sse({ t: "d", v: delta }));
            }
          }

          const confidenceMatch = fullText.match(/CONFIDENCE:\s*(0?\.\d+|1\.0|1)/i);
          const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5;
          const answer = fullText.replace(/\nCONFIDENCE:\s*(0?\.\d+|1\.0|1)\s*$/i, "").trim();

          controller.enqueue(sse({ t: "r", answer, sources, confidence }));
        } catch {
          controller.enqueue(sse({
            t: "r",
            answer: "Failed to generate response. Please check your API key.",
            sources: [],
            confidence: 0,
          }));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, { headers: SSE_HEADERS });
  } catch (err) {
    console.error("Query error:", err);
    return singleEvent({ t: "r", answer: "Failed to process query.", sources: [], confidence: 0 });
  }
}
