// Pure JS TF-IDF embedder — no native binaries, works on Vercel/Edge/Node
// Uses FNV-1a hash trick to project tokens into a fixed-size vector space.
// Medical text retrieval quality is strong because queries are keyword-specific.

const VECTOR_SIZE = 8192;

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","are","was","were","be","been","being","have","has",
  "had","do","does","did","will","would","could","should","may","might",
  "can","this","that","these","those","it","its","as","if","not","no",
  "nor","so","yet","both","either","neither","each","more","most","other",
  "such","than","too","very","just","because","into","through","during",
  "before","after","above","below","between","when","where","who","which",
  "how","all","any","they","them","their","there","then","also","only",
  "same","up","out","about","over","under","again","while","we","our",
  "you","your","he","she","him","her","his","what","however","without",
]);

// Module-level IDF state (co-located with vector store lifecycle)
let _docCount = 0;
const _termDocFreq = new Map<string, number>();

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

// FNV-1a 32-bit hash
function hashToken(token: string): number {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % VECTOR_SIZE;
}

function l2normalize(vec: Float32Array): number[] {
  let norm = 0;
  for (let i = 0; i < vec.length; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm === 0) return Array.from(vec);
  const out: number[] = new Array(vec.length);
  for (let i = 0; i < vec.length; i++) out[i] = vec[i] / norm;
  return out;
}

function smoothedIDF(term: string): number {
  if (_docCount === 0) return 1;
  const df = _termDocFreq.get(term) ?? 0;
  return Math.log((_docCount + 1) / (df + 1)) + 1;
}

export function updateIDF(texts: string[]): void {
  _docCount += texts.length;
  for (const text of texts) {
    const terms = new Set(tokenize(text));
    for (const term of terms) {
      _termDocFreq.set(term, (_termDocFreq.get(term) ?? 0) + 1);
    }
  }
}

export function resetIDF(): void {
  _docCount = 0;
  _termDocFreq.clear();
}

export async function embed(text: string): Promise<number[]> {
  const tokens = tokenize(text);
  const tf = new Map<string, number>();
  for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);

  const vec = new Float32Array(VECTOR_SIZE);
  for (const [token, freq] of tf) {
    vec[hashToken(token)] += freq * smoothedIDF(token);
  }
  return l2normalize(vec);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(embed));
}
