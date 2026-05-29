import { env, pipeline, FeatureExtractionPipeline } from "@xenova/transformers";
import path from "path";

// On Vercel the only writable dir is /tmp; locally use .cache
const cacheDir =
  process.env.VERCEL || process.env.NODE_ENV === "production"
    ? "/tmp/transformers_cache"
    : path.join(process.cwd(), ".cache", "transformers");

env.cacheDir = cacheDir;
// Disable remote model fetching in offline environments (falls back gracefully)
env.allowLocalModels = true;

let _pipeline: FeatureExtractionPipeline | null = null;

async function getPipeline(): Promise<FeatureExtractionPipeline> {
  if (!_pipeline) {
    _pipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return _pipeline;
}

export async function embed(text: string): Promise<number[]> {
  const extractor = await getPipeline();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const extractor = await getPipeline();
  const results: number[][] = [];
  for (const text of texts) {
    const output = await extractor(text, { pooling: "mean", normalize: true });
    results.push(Array.from(output.data as Float32Array));
  }
  return results;
}
