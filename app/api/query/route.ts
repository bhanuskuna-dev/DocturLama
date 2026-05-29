import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { embed } from "@/lib/embedder";
import { similaritySearch } from "@/lib/vectorStore";
import { SourceCitation } from "@/lib/types";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); }

export async function POST(req: NextRequest) {
  try {
    const { question, topK = 3 } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const queryEmbedding = await embed(question);
    const chunks = similaritySearch(queryEmbedding, topK);

    if (chunks.length === 0) {
      return NextResponse.json({
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

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const rawAnswer = message.content[0].type === "text" ? message.content[0].text : "";

    const confidenceMatch = rawAnswer.match(/CONFIDENCE:\s*(0?\.\d+|1\.0|1)/i);
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5;
    const answer = rawAnswer.replace(/\nCONFIDENCE:\s*(0?\.\d+|1\.0|1)\s*$/i, "").trim();

    const sources: SourceCitation[] = chunks.map((c, i) => ({
      label: `Source ${i + 1}`,
      text: c.text.slice(0, 200) + (c.text.length > 200 ? "…" : ""),
      source: c.source,
      chunkIndex: c.chunkIndex,
    }));

    return NextResponse.json({ answer, sources, confidence });
  } catch (err) {
    console.error("Query error:", err);
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 });
  }
}
