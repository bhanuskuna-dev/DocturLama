import { Chunk } from "./types";

// Module-level singleton — persists across requests in the same Node.js process
let store: Chunk[] = [];

export function addChunks(chunks: Chunk[]): void {
  store.push(...chunks);
}

export function clearStore(): void {
  store = [];
}

export function getChunkCount(): number {
  return store.length;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function similaritySearch(queryEmbedding: number[], topK = 3): Chunk[] {
  if (store.length === 0) return [];

  const scored = store.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

export function getDocuments(): Array<{ source: string; chunkCount: number }> {
  const map = new Map<string, number>();
  for (const chunk of store) {
    map.set(chunk.source, (map.get(chunk.source) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([source, chunkCount]) => ({ source, chunkCount }));
}
