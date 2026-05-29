# DocturLama

**Healthcare RAG Assistant for Clinicians and Patients**

DocturLama is a production-ready clinical decision support tool built with Next.js 15, Claude (claude-sonnet-4-6), and OpenAI embeddings. It demonstrates Retrieval-Augmented Generation (RAG) applied to medical document Q&A, doctor note enhancement, multimodal clinical input, and automated AI evaluation.

---

## Features

| Feature | Description |
|---|---|
| **Document Upload** | PDF and plaintext ingestion with drag-and-drop |
| **500-Token Chunking** | Sliding window with 100-token overlap, sentence-boundary-aware |
| **RAG Q&A** | OpenAI embeddings + cosine similarity retrieval + Claude answers with [Source N] citations |
| **Confidence Scores** | 0-1 score on every answer reflecting context support quality |
| **Doctor Note Enhancer** | Claude returns structured diff suggestions; line-by-line Accept/Reject UI |
| **Multimodal Input** | Text, Web Speech API voice, and image upload (Claude Vision) |
| **AI Evals Panel** | 10-pair golden dataset, Claude-as-judge scoring (relevance 0-10, accuracy 0-10) |
| **HIPAA-Conscious** | Zero persistence — all data is session-only, in-memory only |

---

## Architecture

```
+--------------------------------------------------------+
|                     Browser (Next.js)                  |
|  +----------+  +----------+  +-----------+  +------+  |
|  |  Upload  |  |   Q&A    |  |  Enhance  |  |Evals |  |
|  +----+-----+  +----+-----+  +-----+-----+  +--+---+  |
+-------+--------------+--------------+----------+-------+
        |              |              |           |
        v              v              v           v
+-------------------------------------------------------+
|                  Next.js API Routes                   |
|                                                       |
|  /api/parse-pdf    -> pdfjs-dist text extraction      |
|  /api/embeddings   -> chunk + OpenAI embed + store    |
|  /api/query        -> embed query + retrieve + Claude |
|  /api/enhance-note -> Claude structured diff          |
|  /api/analyze-image-> Claude Vision                   |
|  /api/evals        -> golden dataset + Claude judge   |
+--------------+---------------------------+------------+
               |                           |
     +---------v----------+    +-----------v-----------+
     |  In-Memory Store   |    |   External AI APIs    |
     |  (Node.js module)  |    |                       |
     |  Array<Chunk>      |    |  OpenAI: embeddings   |
     |  cosine search     |    |  Anthropic: Claude    |
     +--------------------+    +-----------------------+
```

---

## Setup

### Prerequisites

- Node.js 18+
- OpenAI API key (for `text-embedding-3-small`)
- Anthropic API key (for Claude claude-sonnet-4-6)

### Local Development

```bash
git clone https://github.com/bhanuskuna-dev/docturlama
cd docturlama
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

Open http://localhost:3000.

### Environment Variables

```
OPENAI_API_KEY=sk-...         # For text-embedding-3-small
ANTHROPIC_API_KEY=sk-ant-...  # For Claude
```

### Deploy to Vercel

```bash
vercel
# Set OPENAI_API_KEY and ANTHROPIC_API_KEY in Vercel project settings
```

---

## Case Study

### Why RAG Over Fine-Tuning for Healthcare

Fine-tuning bakes knowledge into model weights. RAG retrieves knowledge at inference time from a document store. For healthcare, RAG wins on three critical axes:

**1. Auditability**
Every RAG answer traces directly to source chunks — clinicians can read `[Source 1]` and verify the underlying text. Fine-tuned models produce outputs whose provenance is opaque, an unacceptable property for clinical decisions under regulatory scrutiny (FDA SaMD, EU MDR).

**2. Knowledge freshness**
Clinical guidelines change frequently (ACLS protocols, drug interaction databases, formulary updates). Fine-tuning requires retraining on each update — expensive and slow. RAG simply replaces documents in the store; updated knowledge is live immediately.

**3. Cost and specialization**
Fine-tuning foundation models costs thousands of dollars and requires curated labeled datasets that are hard to obtain in healthcare (HIPAA, IRB constraints). RAG works with any general-purpose LLM plus a document corpus assembled by the clinical team.

**The tradeoff**: RAG requires retrieval quality — if the right chunk isn't retrieved, the answer fails silently. Fine-tuning embeds knowledge more robustly for narrow, high-frequency queries but cannot generalize to new documents.

---

### 500-Token Chunk Rationale

The chunk size sits at the intersection of retrieval precision and answer completeness.

**Too small (< 100 tokens)**
Individual sentences lack enough clinical context. Embedding a sentence like "Contraindicated in renal failure" without its surrounding drug name creates retrieval misses on semantically similar queries.

**Too large (> 1000 tokens)**
Large chunks dilute the embedding signal with unrelated content. A 2000-token section of a clinical guideline may cover three different conditions; its embedding vector averages over all three, harming precision retrieval for any single condition.

**500 tokens**
Roughly corresponds to 3-5 clinical paragraphs or one SOAP note section — enough context for meaningful embedding while staying semantically focused. This is consistent with empirical findings in LlamaIndex and LangChain benchmarks (2023-2024) showing 512-token chunks as a near-optimal default across medical corpora.

**100-token overlap**
Prevents boundary artifacts where a sentence is split across two chunks and neither chunk captures the full meaning. The overlap cost (20% extra chunks) is justified by the reduction in retrieval edge cases.

---

### Retrieval Failure Modes

| Failure Mode | Description | Mitigation |
|---|---|---|
| **Semantic gap** | Query uses different terminology than the document ("heart attack" vs "myocardial infarction") | Hybrid search (BM25 + dense), query expansion, medical synonym dictionaries |
| **Chunk boundary artifacts** | Key information split across two chunks; neither retrieved | Overlap (implemented), parent-document retrieval, recursive chunking |
| **Embedding model limits** | `text-embedding-3-small` underperforms on rare medical abbreviations | Use domain-adapted models (MedCPT, BiomedBERT) |
| **Insufficient context** | Top-3 chunks don't contain the answer despite high similarity scores | Increase topK dynamically, use re-ranking (Cohere Rerank, cross-encoder) |
| **Hallucination on weak retrieval** | Low-confidence context leads Claude to fill gaps with hallucinated facts | Confidence thresholds: refuse to answer below 0.3 |
| **Stale documents** | Uploaded documents are outdated; model answers confidently with wrong information | Document metadata with upload timestamps, TTL expiration warnings |
| **Distribution shift** | Evals pass but production queries have different linguistic patterns | Ongoing human eval sampling, shadow logging of production queries |

---

### Eval at Scale

The 10-pair golden dataset in this project validates the pipeline but is insufficient for production confidence. Scaling evaluation requires:

**RAGAS Framework**
RAGAS provides automated metrics:
- *Context Recall*: Does the retrieved context contain the answer?
- *Context Precision*: Is the retrieved context relevant (not noisy)?
- *Answer Faithfulness*: Does the answer stick to the context, or hallucinate?
- *Answer Relevancy*: Does the answer address the question?

**Human-in-the-Loop**
For high-stakes clinical assertions, a workflow where clinical staff review a random 5% sample of production answers provides ground truth signal that fine-tunes automated scoring thresholds.

**Drift Detection**
Monitor:
- Mean cosine similarity of top-k results over time (declining = retrieval degradation)
- Answer confidence score distribution (shifting lower = knowledge gap growth)
- User explicit feedback (thumbs up/down) as a real-time signal

**At-Scale Pipeline (recommended)**
```
Production query -> Log (question, retrieved chunks, answer, confidence)
                -> Sample 5% -> Human review queue
                -> RAGAS batch scoring nightly
                -> Alert if context_precision < 0.7 or answer_faithfulness < 0.8
```

---

### Competitor Analysis

| Product | Approach | Strengths | Weaknesses vs DocturLama |
|---|---|---|---|
| **Epic Cosmos** | Federated EHR analytics on Epic's patient network (250M+ records) | Massive real-world data, deep EHR integration, de-identification at scale | No document RAG, requires Epic installation, not accessible to independent providers or patients |
| **AWS HealthLake** | FHIR-native managed data lake with NLP and comprehend medical | HIPAA BAA, scalable infrastructure, AWS ecosystem integration | Infrastructure-heavy, no built-in LLM Q&A UX, requires significant engineering to build a query interface |
| **Google Med-PaLM 2** | Fine-tuned LLM on medical licensing exam data (USMLE) | State-of-the-art medical reasoning, strong benchmark scores | Black-box responses without source citations, no document RAG, limited API access |
| **Nabla** | Clinical ambient AI for real-time note generation | Excellent voice-to-SOAP workflow, EHR integrations | Narrow use case (note generation only), subscription SaaS with no open architecture, no RAG over custom documents |

**DocturLama's niche**: Open architecture RAG over your documents with full source traceability, no EHR dependency, and a transparent eval framework — suited for research clinics, medical education, and patient advocacy organizations that need document-grounded Q&A without vendor lock-in.

---

## Tech Stack

- **Next.js 15** (App Router, Server Components, API Routes)
- **TypeScript**
- **Tailwind CSS** (dark slate + sky blue design system)
- **@anthropic-ai/sdk** — Claude for Q&A, note enhancement, image analysis, eval judging
- **openai** — `text-embedding-3-small` embeddings only
- **pdfjs-dist** — server-side PDF text extraction
- **lucide-react** — icons

---

## Project Structure

```
app/
  layout.tsx             Root layout: sidebar + HIPAA banner
  page.tsx               Redirects to /upload
  upload/page.tsx        Document upload UI
  qa/page.tsx            RAG Q&A chat
  enhance/page.tsx       Doctor note diff UI
  multimodal/page.tsx    Text + voice + image
  evals/page.tsx         Golden dataset eval panel
  api/
    embeddings/          Chunk + embed + store
    query/               RAG query
    enhance-note/        Note suggestions
    analyze-image/       Claude Vision
    parse-pdf/           PDF text extraction
    evals/               Evaluation runner
components/
  Sidebar.tsx            Navigation
  HipaaBanner.tsx        HIPAA disclaimer
lib/
  types.ts               TypeScript interfaces
  chunker.ts             500-token sliding window
  vectorStore.ts         In-memory cosine similarity store
  evaluations.ts         10-pair golden dataset
```

---

## License

MIT
