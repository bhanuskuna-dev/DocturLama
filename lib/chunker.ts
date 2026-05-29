const CHUNK_SIZE = 500;
const OVERLAP = 100;

function approximateTokenCount(text: string): number {
  // ~4 chars per token for English medical text
  return Math.ceil(text.length / 4);
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function chunkText(text: string, source: string): Array<{ text: string; source: string; chunkIndex: number }> {
  const sentences = splitIntoSentences(text);
  const chunks: Array<{ text: string; source: string; chunkIndex: number }> = [];

  let buffer: string[] = [];
  let bufferTokens = 0;
  let chunkIndex = 0;

  const flushBuffer = () => {
    const chunkText = buffer.join(" ").trim();
    if (chunkText.length > 0) {
      chunks.push({ text: chunkText, source, chunkIndex });
      chunkIndex++;
    }
  };

  for (const sentence of sentences) {
    const sentTokens = approximateTokenCount(sentence);

    if (bufferTokens + sentTokens > CHUNK_SIZE && buffer.length > 0) {
      flushBuffer();
      // Keep overlap: retain last sentences whose total tokens <= OVERLAP
      const overlapBuffer: string[] = [];
      let overlapTokens = 0;
      for (let i = buffer.length - 1; i >= 0; i--) {
        const t = approximateTokenCount(buffer[i]);
        if (overlapTokens + t <= OVERLAP) {
          overlapBuffer.unshift(buffer[i]);
          overlapTokens += t;
        } else {
          break;
        }
      }
      buffer = overlapBuffer;
      bufferTokens = overlapTokens;
    }

    buffer.push(sentence);
    bufferTokens += sentTokens;
  }

  if (buffer.length > 0) {
    flushBuffer();
  }

  return chunks;
}
