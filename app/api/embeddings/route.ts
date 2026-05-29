import { NextRequest, NextResponse } from "next/server";
import { embedBatch, updateIDF, resetIDF } from "@/lib/embedder";
import { chunkText } from "@/lib/chunker";
import { addChunks, clearStore, getDocuments } from "@/lib/vectorStore";
import { Chunk } from "@/lib/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, source, reset } = body as { text: string; source: string; reset?: boolean };

    if (!text || !source) {
      return NextResponse.json({ error: "text and source are required" }, { status: 400 });
    }

    if (reset) {
      clearStore();
      resetIDF();
    }

    const rawChunks = chunkText(text, source);
    if (rawChunks.length === 0) {
      return NextResponse.json({ error: "No chunks generated from text" }, { status: 400 });
    }

    // Update IDF state before embedding so new chunks are factored in
    updateIDF(rawChunks.map((c) => c.text));

    const allEmbeddings = await embedBatch(rawChunks.map((c) => c.text));

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
  resetIDF();
  return NextResponse.json({ ok: true });
}
