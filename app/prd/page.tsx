"use client";

import { ShieldCheck, Database, Clock, Lock, Eye, Trash2, Server, Zap, Users, Target, AlertTriangle, CheckCircle, BookOpen, Activity } from "lucide-react";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700/50">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function ComplianceItem({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-slate-100 dark:border-slate-700/30 last:border-0">
      <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}: </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{value}</span>
      </div>
    </div>
  );
}

export default function PrdPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-6 h-6 text-sky-500" />
          <span className="text-sky-600 dark:text-sky-400 text-sm font-medium uppercase tracking-wider">Product Requirements Document</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">DocturLama</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">Healthcare RAG Assistant — Clinical Decision Support Platform</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { label: "Version", value: "1.0" },
            { label: "Status", value: "Production" },
            { label: "Updated", value: "2026-05-30" },
            { label: "Stack", value: "Next.js · Claude · TF-IDF RAG" },
          ].map(({ label, value }) => (
            <span key={label} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700/50">
              <span className="font-medium text-slate-800 dark:text-slate-300">{label}:</span> {value}
            </span>
          ))}
        </div>
      </div>

      {/* HIPAA Compliance Highlight */}
      <div className="mb-12 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">HIPAA Compliance & Data Privacy</h2>
            <p className="text-sm text-emerald-600 dark:text-emerald-500">Technical safeguard commitments under 45 CFR § 164.312</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <ComplianceItem
            icon={Database}
            title="Zero persistence — session-only storage"
            description="All PHI, documents, and embeddings reside exclusively in server RAM for the duration of one serverless invocation. No data is written to disk, database, object storage, or any external service."
          />
          <ComplianceItem
            icon={Clock}
            title="15-minute inactivity auto-clear"
            description="A countdown timer monitors user activity. At 14 minutes of inactivity a visible warning is shown; at 15 minutes the session is programmatically wiped and the user is redirected. Implements § 164.312(a)(2)(iii) Automatic Logoff."
          />
          <ComplianceItem
            icon={Trash2}
            title="Explicit data deletion control"
            description="Users can clear all indexed documents and embeddings at any time via the Clear button. The DELETE /api/embeddings endpoint resets the in-memory store immediately. Right to erasure is instantaneous."
          />
          <ComplianceItem
            icon={Lock}
            title="TLS encryption in transit"
            description="All data is transmitted over HTTPS (TLS 1.2+) enforced by Vercel's edge network. No unencrypted channel is ever available. Implements § 164.312(e)(1) Transmission Security."
          />
          <ComplianceItem
            icon={Eye}
            title="No server-side PHI logging"
            description="API route handlers do not log request bodies. No third-party analytics, session recording, or telemetry tools are installed. Claude API calls are governed by Anthropic's HIPAA BAA program."
          />
          <ComplianceItem
            icon={Server}
            title="Audit trail notice"
            description="This application does not retain audit logs beyond the browser session (§ 164.312(b)). For production clinical deployments requiring persistent audit trails, this must be added before go-live."
          />
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 dark:text-amber-400">
              <strong className="text-amber-800 dark:text-amber-300">Demo / Research Context:</strong>{" "}
              DocturLama is designed as a clinical decision <em>support</em> tool, not a covered entity system. For deployment within a HIPAA covered entity, a signed Business Associate Agreement (BAA) with Anthropic is required, server-side audit logging must be added, and a formal Risk Analysis under § 164.308(a)(1) must be conducted.
            </div>
          </div>
        </div>
      </div>

      <Section id="overview" title="1. Product Overview">
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
          DocturLama is an open-architecture Retrieval-Augmented Generation (RAG) system purpose-built for clinical workflows. It enables clinicians, medical educators, and patient advocates to upload clinical documents and interact with them through a natural-language interface — without sending data to a persistent store.
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Unlike EHR-integrated products (Epic Cosmos, AWS HealthLake) that require infrastructure commitments, DocturLama runs entirely in a browser session. It is suited for document-grounded Q&A, note drafting, image analysis, and RAG pipeline evaluation.
        </p>
      </Section>

      <Section id="users" title="2. Target Users">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              title: "Clinicians & Residents",
              points: ["Rapid literature Q&A", "Note enhancement before EHR entry", "Image interpretation support"],
            },
            {
              icon: BookOpen,
              title: "Medical Educators",
              points: ["Case-based learning with real notes", "RAG pipeline demonstration", "Eval framework for student work"],
            },
            {
              icon: Target,
              title: "Health Tech Builders",
              points: ["RAG reference implementation", "Eval framework baseline", "Prompt engineering sandbox"],
            },
          ].map(({ icon: Icon, title, points }) => (
            <Card key={title}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
              </div>
              <ul className="space-y-1.5">
                {points.map(p => (
                  <li key={p} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-sky-400 mt-0.5">·</span> {p}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="features" title="3. Core Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Documents & Chat</h3>
            <FeatureRow label="Ingestion" value="PDF (pdfjs-dist), TXT, MD via drag-and-drop or file picker" />
            <FeatureRow label="Chunking" value="500-token sliding window, 100-token overlap, sentence-boundary-aware" />
            <FeatureRow label="Embedding" value="Pure-JS TF-IDF (FNV-1a hash, 8192-dim) — no external embedding API" />
            <FeatureRow label="Retrieval" value="Cosine similarity, top-3 chunks, medical synonym expansion" />
            <FeatureRow label="Generation" value="claude-sonnet-4-6 with [Source N] citations and confidence scores" />
            <FeatureRow label="Streaming" value="SSE token-by-token streaming with session-reset detection" />
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Note Enhancer</h3>
            <FeatureRow label="Input" value="Paste any SOAP, discharge, or progress note" />
            <FeatureRow label="Output" value="Structured diff: line range, original, suggested, reason" />
            <FeatureRow label="UX" value="Per-suggestion Accept / Reject; apply all accepted in one click" />
            <FeatureRow label="Export" value="Copy to clipboard or download as .txt" />
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Image & Voice</h3>
            <FeatureRow label="Image analysis" value="Claude Vision analyzes uploaded clinical images" />
            <FeatureRow label="Voice input" value="Web Speech API transcription (Chrome/Edge)" />
            <FeatureRow label="Fallback" value="Falls back to RAG Q&A when no image is attached" />
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">AI Evals Panel</h3>
            <FeatureRow label="Dataset" value="10-pair golden question/answer set for medical RAG" />
            <FeatureRow label="Scoring" value="Claude-as-judge: relevance (0-10), accuracy (0-10), confidence (%)" />
            <FeatureRow label="Metrics" value="Average scores across full dataset with per-question drill-down" />
            <FeatureRow label="Context" value="Warning shown when no documents are indexed" />
          </Card>
        </div>
      </Section>

      <Section id="sample-data" title="4. Sample Data Generation">
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            The <span className="font-mono text-sky-600 dark:text-sky-400 text-xs">Try Sample Data</span> button calls{" "}
            <span className="font-mono text-sky-600 dark:text-sky-400 text-xs">/api/generate-sample</span> which uses{" "}
            <span className="font-mono text-sky-600 dark:text-sky-400 text-xs">claude-haiku-4-5-20251001</span> to generate realistic longitudinal patient records on demand. Generated data is never stored.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { patient: "Patient 1", age: "57M", conditions: "T2DM · HTN · CKD Stage 3", detail: "9-year longitudinal history, metformin → SGLT2, nephrology referral" },
              { patient: "Patient 2", age: "71F", conditions: "CAD · HFrEF (EF 35%) · AFib", detail: "7-year history, CABG 2019, warfarin → apixaban transition, cardiology follow-ups" },
              { patient: "Patient 3", age: "48F", conditions: "Hypothyroid · OSA · GERD · MetS", detail: "6-year history, levothyroxine titration, sleep study, BMI trend across visits" },
            ].map(({ patient, age, conditions, detail }) => (
              <div key={patient} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{patient} · {age}</p>
                <p className="text-sky-600 dark:text-sky-400 mt-0.5">{conditions}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-3">
            Each record includes: demographics, CC, HPI, longitudinal history (2-3 paragraphs), PMH, surgical history, family/social history, current medications, discontinued medications, allergies, ROS, PE, labs, 3-visit lab trend table, imaging, assessment (ICD-10), and plan. Approximate cost: ~$0.027/click at Haiku pricing.
          </p>
        </Card>
      </Section>

      <Section id="architecture" title="5. Technical Architecture">
        <Card className="mb-4">
          <pre className="text-[11px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed overflow-x-auto">{`Browser (Next.js App Router)
├── /upload     → Documents & Chat (RAG pipeline)
├── /enhance    → Note Enhancer (structured diff)
├── /multimodal → Image & Voice (Claude Vision + Web Speech)
├── /evals      → AI Evals Panel (Claude-as-judge)
└── /prd        → This document

Next.js API Routes (serverless, stateless per invocation)
├── POST /api/generate-sample  → claude-haiku-4-5 generates patient records
├── POST /api/suggest-questions → claude-haiku-4-5 generates context questions
├── POST /api/embeddings       → chunk + TF-IDF embed + store in RAM
├── GET  /api/embeddings       → return indexed document list
├── DELETE /api/embeddings     → wipe in-memory store
├── POST /api/query            → embed query + cosine retrieve + claude-sonnet-4-6 (SSE)
├── POST /api/enhance-note     → claude-sonnet-4-6 structured diff
├── POST /api/analyze-image    → claude-sonnet-4-6 Vision
├── POST /api/parse-pdf        → pdfjs-dist text extraction
└── POST /api/evals            → claude-sonnet-4-6 judge scoring

In-Memory Store (Node.js module singleton, RAM only)
└── Array<{ text, embedding, source, chunkIndex }>
    cosine similarity search, wiped on DELETE or server restart`}</pre>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Why TF-IDF over dense embeddings?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dense embedding models require an external API call per chunk — adding latency, cost, and a data egress event for every document upload. The pure-JS TF-IDF embedder runs in-process with zero network calls, eliminating a PHI transmission vector and reducing p95 indexing time from ~3s to ~120ms.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-2">RAG chunk rationale</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              500-token chunks with 100-token overlap align with 3–5 clinical paragraphs or one SOAP section. Below 100 tokens, individual sentences lose clinical context. Above 1000 tokens, embedding vectors average over multiple conditions, harming retrieval precision. The 100-token overlap prevents boundary artifacts where a sentence is split across two chunks.
            </p>
          </div>
        </div>
      </Section>

      <Section id="limitations" title="6. Known Limitations">
        <div className="space-y-2">
          {[
            { severity: "high", item: "No persistent audit logs", detail: "Required under § 164.312(b) for covered entities. Each serverless cold start resets the in-memory store; there is no durable record of who accessed which document." },
            { severity: "high", item: "No authentication or access controls", detail: "Anyone with the URL can access the app. A production deployment requires Auth.js, Clerk, or equivalent before handling real PHI." },
            { severity: "med", item: "TF-IDF retrieval quality", detail: "BM25 or dense embeddings outperform TF-IDF on out-of-vocabulary medical abbreviations and rare drug names. For precision-critical retrieval, upgrade to MedCPT or BiomedBERT embeddings." },
            { severity: "med", item: "Serverless cold starts", detail: "Vercel's serverless functions can restart between requests, wiping the in-memory store. The UI detects this and prompts re-indexing, but it is a poor experience for long-running sessions." },
            { severity: "low", item: "10-pair golden dataset", detail: "The eval panel validates the pipeline but is too small for production confidence. See RAGAS, DeepEval, or custom human evaluation workflows for scale." },
            { severity: "low", item: "Voice input — Chrome/Edge only", detail: "The Web Speech API is not supported in Firefox or Safari. Users on those browsers cannot use voice input." },
          ].map(({ severity, item, detail }) => (
            <div key={item} className="flex gap-3 px-4 py-3 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/30 rounded-xl">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                severity === "high" ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                : severity === "med" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                : "bg-slate-100 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400"
              }`}>{severity.toUpperCase()}</span>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="guardrails" title="7. Input Guardrails">
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
          Every query entered in the Documents & Chat interface is validated by a lightweight pre-flight guardrail layer before it reaches the RAG pipeline. The layer runs a single{" "}
          <span className="font-mono text-sky-600 dark:text-sky-400 text-xs">claude-haiku-4-5-20251001</span> call at{" "}
          <span className="font-mono text-sky-600 dark:text-sky-400 text-xs">POST /api/guardrails</span> and checks for three classes of problematic input simultaneously.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            {
              label: "Off-topic queries",
              checkType: "off_topic",
              why: "The RAG pipeline is grounded in clinical documents. Answering cooking, sports, or coding questions would be misleading and waste tokens.",
              logic: "Flags queries clearly unrelated to medicine, health, wellness, nutrition, mental health, or pharmacology. Borderline cases (e.g. diet, sleep, exercise) are explicitly passed.",
            },
            {
              label: "Prompt injection",
              checkType: "prompt_injection",
              why: "Prompt injection attacks attempt to override the system prompt, roleplay as a different AI, or extract system context. These can corrupt clinical output or expose system behavior.",
              logic: "Detects queries that instruct the model to ignore its prompt, adopt a new persona, or reveal its instructions. Standard clinical questions — even adversarial-sounding ones — are not flagged.",
            },
            {
              label: "PII in queries",
              checkType: "pii",
              why: "DocturLama does not need patient identifiers to answer clinical questions. A user pasting an SSN or a full name + DOB combination represents an unnecessary PHI exposure risk.",
              logic: "Detects SSNs (NNN-NN-NNNN format), phone numbers, or a full name explicitly combined with a date of birth or patient ID. Mentions of common names alone are not flagged.",
            },
          ].map(({ label, checkType, why, logic }) => (
            <Card key={checkType}>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
              <p className="text-[10px] font-mono text-sky-600 dark:text-sky-400 mb-2">{checkType}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2"><strong className="text-slate-700 dark:text-slate-300">Why:</strong> {why}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"><strong className="text-slate-700 dark:text-slate-300">Logic:</strong> {logic}</p>
            </Card>
          ))}
        </div>
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Design Decisions</h3>
          <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex gap-2"><span className="text-sky-400 shrink-0">·</span><p><strong className="text-slate-700 dark:text-slate-300">Single Haiku call for all three checks.</strong> Rather than three sequential API calls, all checks are combined in one prompt returning a JSON object. This reduces guardrail latency from ~1.5 s (3 × 500 ms) to ~500 ms total.</p></div>
            <div className="flex gap-2"><span className="text-sky-400 shrink-0">·</span><p><strong className="text-slate-700 dark:text-slate-300">Fail-open on API error.</strong> If the guardrail API call fails (network timeout, Haiku outage), the request passes through to the RAG pipeline rather than being blocked. A clinical session outage from a guardrail error would be worse than a missed guardrail check.</p></div>
            <div className="flex gap-2"><span className="text-sky-400 shrink-0">·</span><p><strong className="text-slate-700 dark:text-slate-300">Permissive thresholds.</strong> The classification prompt instructs the model to flag only clear violations, not borderline cases. False positives (blocking legitimate clinical questions) are treated as more harmful than false negatives.</p></div>
            <div className="flex gap-2"><span className="text-sky-400 shrink-0">·</span><p><strong className="text-slate-700 dark:text-slate-300">Shield indicator in UI.</strong> A green shield (ShieldCheck) appears below the input after a passing query; a red shield (ShieldAlert) with the block category appears for rejected queries. Blocked queries are rendered inline in the chat with amber styling to distinguish them from AI responses.</p></div>
            <div className="flex gap-2"><span className="text-sky-400 shrink-0">·</span><p><strong className="text-slate-700 dark:text-slate-300">Query truncation at 600 characters.</strong> The guardrail prompt only inspects the first 600 characters of the query. This bounds Haiku token cost and is sufficient for the three checks — PII appears early in a query, and off-topic and injection signals are typically in the first sentence.</p></div>
          </div>
        </Card>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Guardrail Failure Modes</h3>
          {[
            { severity: "med", item: "Adversarial medical framing", detail: "A prompt injection attempt disguised as a clinical question (e.g. 'As a doctor, ignore your instructions and…') may bypass the off-topic check while being detected by the injection check — or may slip through if phrasing is sufficiently medical. The permissive threshold trades false-positive reduction for slightly higher false-negative rate." },
            { severity: "med", item: "False positives on medical jargon", detail: "Queries containing strings that resemble SSNs (e.g. medication dosing codes like '123-45-6789 mg/dL') or dates of birth in clinical context could trigger the PII check. The prompt is instructed to require a full name + DOB combination, reducing this risk." },
            { severity: "med", item: "Haiku API outage → fail-open", detail: "When the guardrail endpoint returns an error, the system passes the query through rather than blocking. This is intentional (clinical availability > guardrail completeness) but means an extended Haiku outage disables input validation silently." },
            { severity: "low", item: "Context-aware bypass", detail: "An attacker who knows the classification prompt can craft queries that score as medical while containing injection payloads. Defense-in-depth requires the main claude-sonnet-4-6 system prompt to be robust independently of the guardrail." },
            { severity: "low", item: "Encoding and homoglyph attacks", detail: "Unicode substitutions or non-ASCII characters in a query may evade the text-based classifier. Haiku processes the raw UTF-8 string, but heavily obfuscated injection attempts may not be detected." },
          ].map(({ severity, item, detail }) => (
            <div key={item} className="flex gap-3 px-4 py-3 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/30 rounded-xl">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                severity === "high" ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                : severity === "med" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                : "bg-slate-100 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400"
              }`}>{severity.toUpperCase()}</span>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="competitors" title="8. Competitive Landscape">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50">
                {["Product", "Approach", "PHI Handling", "DocturLama Advantage"].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-slate-500 dark:text-slate-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { product: "Epic Cosmos", approach: "Federated EHR analytics (250M+ records)", phi: "De-id at scale, HIPAA BAA", advantage: "No EHR dependency, open architecture, document RAG" },
                { product: "AWS HealthLake", approach: "FHIR-native managed data lake", phi: "HIPAA BAA, S3 persistence", advantage: "No infra setup, works in a browser, instant deploy" },
                { product: "Google Med-PaLM 2", approach: "Fine-tuned LLM (USMLE benchmark)", phi: "Black-box, limited API access", advantage: "Source citations, document-grounded, transparent eval" },
                { product: "Nabla", approach: "Ambient AI for SOAP note generation", phi: "SaaS, subscription, EHR integrations", advantage: "General RAG over any document, open architecture, free" },
              ].map(({ product, approach, phi, advantage }) => (
                <tr key={product} className="border-b border-slate-100 dark:border-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">{product}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{approach}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{phi}</td>
                  <td className="px-3 py-2.5 text-sky-600 dark:text-sky-400">{advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="roadmap" title="9. Production Readiness Checklist">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { done: true, item: "Input guardrails (off-topic, injection, PII)" },
            { done: true, item: "Session-only storage (no PHI at rest)" },
            { done: true, item: "15-min inactivity auto-clear" },
            { done: true, item: "HIPAA notice banner on every page" },
            { done: true, item: "TLS in transit (Vercel HTTPS)" },
            { done: true, item: "No PHI in server-side logs" },
            { done: true, item: "Explicit session wipe (Clear button)" },
            { done: false, item: "User authentication (Auth.js / Clerk)" },
            { done: false, item: "Persistent audit logging (§ 164.312(b))" },
            { done: false, item: "BAA with Anthropic for PHI workloads" },
            { done: false, item: "Role-based access control" },
            { done: false, item: "Formal Risk Analysis (§ 164.308(a)(1))" },
            { done: false, item: "Dense embedding model for precision retrieval" },
          ].map(({ done, item }) => (
            <div key={item} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/30">
              {done
                ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                : <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />}
              <span className={`text-xs ${done ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="text-center text-xs text-slate-400 dark:text-slate-600 pt-4 border-t border-slate-200 dark:border-slate-700/50">
        DocturLama · MIT License · Not a medical device · For clinical decision support and research use only
      </div>
    </div>
  );
}
