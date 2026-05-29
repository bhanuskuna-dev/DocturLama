export interface Chunk {
  id: string;
  text: string;
  embedding: number[];
  source: string;
  chunkIndex: number;
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  chunkCount: number;
}

export interface QueryResult {
  answer: string;
  sources: SourceCitation[];
  confidence: number;
}

export interface SourceCitation {
  label: string;
  text: string;
  source: string;
  chunkIndex: number;
}

export interface NoteSuggestion {
  lineRange: [number, number];
  original: string;
  suggested: string;
  reason: string;
  accepted?: boolean;
}

export interface EvalPair {
  id: string;
  question: string;
  expectedAnswer: string;
  category: string;
}

export interface EvalResult {
  id: string;
  question: string;
  expectedAnswer: string;
  actualAnswer: string;
  relevanceScore: number;
  accuracyScore: number;
  retrievedSources: number;
  confidence: number;
}
