import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { embed } from "@/lib/embedder";
import { similaritySearch } from "@/lib/vectorStore";
import { GOLDEN_DATASET } from "@/lib/evaluations";
import { EvalResult } from "@/lib/types";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); }

async function runSingleEval(
  question: string,
): Promise<{ actualAnswer: string; confidence: number; retrievedSources: number }> {
  const queryEmbedding = await embed(question);
  const chunks = similaritySearch(queryEmbedding, 3);

  if (chunks.length === 0) {
    return { actualAnswer: "No documents in store.", confidence: 0, retrievedSources: 0 };
  }

  const contextBlock = chunks
    .map((c, i) => `[Source ${i + 1}] ${c.text}`)
    .join("\n\n---\n\n");

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: "Answer the clinical question based on the provided context. End with CONFIDENCE: 0.X",
    messages: [
      { role: "user", content: `Context:\n${contextBlock}\n\nQuestion: ${question}` },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const confidenceMatch = raw.match(/CONFIDENCE:\s*(0?\.\d+|1\.0|1)/i);
  const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5;
  const actualAnswer = raw.replace(/\nCONFIDENCE:\s*(0?\.\d+|1\.0|1)\s*$/i, "").trim();

  return { actualAnswer, confidence, retrievedSources: chunks.length };
}

async function judgeAnswer(
  question: string,
  expected: string,
  actual: string
): Promise<{ relevance: number; accuracy: number }> {
  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    system: 'You are an expert medical evaluator. Score the answer on relevance (0-10) and accuracy (0-10) compared to the expected answer. Return only JSON: {"relevance": N, "accuracy": N}',
    messages: [
      { role: "user", content: `Question: ${question}\nExpected: ${expected}\nActual: ${actual}` },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?|\n?```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      relevance: Math.min(10, Math.max(0, Number(parsed.relevance) || 0)),
      accuracy: Math.min(10, Math.max(0, Number(parsed.accuracy) || 0)),
    };
  } catch {
    return { relevance: 0, accuracy: 0 };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const ids: string[] | undefined = body.ids;

    const pairs = ids
      ? GOLDEN_DATASET.filter((p) => ids.includes(p.id))
      : GOLDEN_DATASET;

    const results: EvalResult[] = [];

    for (const pair of pairs) {
      const { actualAnswer, confidence, retrievedSources } = await runSingleEval(pair.question);
      const { relevance, accuracy } = await judgeAnswer(pair.question, pair.expectedAnswer, actualAnswer);

      results.push({
        id: pair.id,
        question: pair.question,
        expectedAnswer: pair.expectedAnswer,
        actualAnswer,
        relevanceScore: relevance,
        accuracyScore: accuracy,
        retrievedSources,
        confidence,
      });
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Evals error:", err);
    return NextResponse.json({ error: "Failed to run evaluations" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ dataset: GOLDEN_DATASET });
}
