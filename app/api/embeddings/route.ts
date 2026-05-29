import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { chunkText } from "@/lib/chunker";
import { addChunks, clearStore, getDocuments } from "@/lib/vectorStore";
import { Chunk } from "@/lib/types";
import { randomUUID } from "crypto";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, source, reset } = body as { text: string; source: string; reset?: boolean };

    if (!text || !source) {
      return NextResponse.json({ error: "text and source are required" }, { status: 400 });
    }

    if (reset) clearStore();

    const rawChunks = chunkText(text, source);
    if (rawChunks.length === 0) {
      return NextResponse.json({ error: "No chunks generated from text" }, { status: 400 });
    }

    // Embed in batches of 20
    const BATCH = 20;
    const allEmbeddings: number[][] = [];
    for (let i = 0; i < rawChunks.length; i += BATCH) {
      const batch = rawChunks.slice(i, i + BATCH);
      const embeddings = await embedBatch(batch.map((c) => c.text));
      allEmbeddings.push(...embeddings);
    }

    const chunks: Chunk[] = rawChunks.map((c, i) => ({
      id: randomUUID(),
      text: c.text,
      embedding: allEmbeddings[i],
      source: c.source,
      chunkIndex: c.chunkIndex,
    }));

    addChunks(chunks);

    return NextResponse.json({
      chunkCount: chunks.length,
      documents: getDocuments(),
    });
  } catch (err) {
    console.error("Embeddings error:", err);
    return NextResponse.json({ error: "Failed to create embeddings" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ documents: getDocuments() });
}

export async function DELETE() {
  clearStore();
  return NextResponse.json({ ok: true });
}
