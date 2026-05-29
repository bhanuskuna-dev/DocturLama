"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2,
  FlaskConical, Send, ChevronDown, ChevronUp, Plus, X, Copy, Check
} from "lucide-react";
import { QueryResult } from "@/lib/types";

interface DocEntry { source: string; chunkCount: number; }
interface Message {
  role: "user" | "assistant";
  content: string;
  result?: QueryResult;
  streaming?: boolean;
}

const SUGGESTED = [
  "What is the recommended first-line treatment for type 2 diabetes?",
  "What are the diagnostic criteria for sepsis?",
  "How is cardiogenic shock managed?",
  "What are the stages of chronic kidney disease?",
  "What is the mechanism of ACE inhibitors?",
];

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 75
    ? "text-emerald-400 border-emerald-700/50 bg-emerald-900/30"
    : pct >= 50
    ? "text-amber-400 border-amber-700/50 bg-amber-900/30"
    : "text-red-400 border-red-700/50 bg-red-900/30";
  return <span className={`text-xs px-2 py-0.5 rounded border font-mono ${color}`}>{pct}% confidence</span>;
}

function SourcesAccordion({ result }: { result: QueryResult }) {
  const [open, setOpen] = useState(false);
  if (!result.sources.length) return null;
  return (
    <div className="mt-2 border border-slate-700/50 rounded-lg overflow-hidden text-xs">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:bg-slate-700/40 transition-colors">
        <span>{result.sources.length} source{result.sources.length > 1 ? "s" : ""} retrieved</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
          {result.sources.map(src => (
            <div key={src.label} className="px-3 py-2">
              <span className="text-sky-400 font-medium">{src.label}</span>
              <span className="text-slate-500 ml-2">{src.source} · chunk {src.chunkIndex}</span>
              <p className="text-slate-400 mt-1 leading-relaxed">{src.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadStepLabels, setUploadStepLabels] = useState(["Parse", "Chunk", "Index"]);
  const [isDragging, setIsDragging] = useState(false);
  const [showDropzone, setShowDropzone] = useState(true);
  const [showMobileDocs, setShowMobileDocs] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const docsRef = useRef(docs);
  useEffect(() => { docsRef.current = docs; }, [docs]);
  const anyLoadStartedRef = useRef(false);

  const hasDocuments = docs.length > 0;

  // Sync UI with server state on mount — detects serverless cold-start resets
  useEffect(() => {
    fetch("/api/embeddings")
      .then(r => r.json())
      .then(d => {
        if (anyLoadStartedRef.current) return;
        if (Array.isArray(d.documents) && d.documents.length > 0) {
          setDocs(d.documents);
          setUploadStatus("success");
          setShowDropzone(false);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const embedText = useCallback(async (text: string, source: string) => {
    const res = await fetch("/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source }),
    });
    if (!res.ok) throw new Error("Embedding failed");
    return res.json();
  }, []);

  const processFile = useCallback(async (file: File) => {
    anyLoadStartedRef.current = true;
    setUploadStepLabels(["Parse", "Chunk", "Index"]);
    setUploadStatus("processing");
    setUploadStep(0);
    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setUploadStep(1);
        setUploadMsg(`Parsing PDF — ${file.name}…`);
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
        if (!res.ok) throw new Error("PDF parsing failed");
        const parsed = await res.json();
        text = parsed.text;
        setUploadMsg(`Parsed ${parsed.pages} page${parsed.pages !== 1 ? "s" : ""} — chunking…`);
      } else {
        setUploadStep(1);
        setUploadMsg(`Reading ${file.name}…`);
        text = await file.text();
        setUploadMsg("Chunking text…");
      }
      setUploadStep(2);
      await new Promise((r) => setTimeout(r, 80));
      setUploadStep(3);
      setUploadMsg("Indexing chunks…");
      const data = await embedText(text, file.name);
      setDocs(data.documents);
      setUploadStatus("success");
      setUploadStep(0);
      setUploadMsg(`Indexed ${data.chunkCount} chunks from ${file.name}`);
      setShowDropzone(false);
      setShowMobileDocs(false);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `${file.name} indexed (${data.chunkCount} chunks). Ask me anything about it.`,
      }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      setUploadStatus("error");
      setUploadStep(0);
      setUploadMsg(err instanceof Error ? err.message : "Upload failed");
    }
  }, [embedText]);

  const loadSample = useCallback(async () => {
    anyLoadStartedRef.current = true;
    setUploadStepLabels(["Generate", "Chunk", "Index"]);
    setUploadStatus("processing");
    setUploadStep(1);
    setUploadMsg("Generating patient records with AI…");
    try {
      const genRes = await fetch("/api/generate-sample", { method: "POST" });
      if (!genRes.ok) throw new Error("Failed to generate sample records");
      const { text, error } = await genRes.json();
      if (error) throw new Error(error);

      setUploadStep(2);
      setUploadMsg("Chunking patient records…");
      await new Promise(r => setTimeout(r, 60));

      setUploadStep(3);
      setUploadMsg("Indexing…");
      const data = await embedText(text, "AI-Generated Patient Records (Sample)");

      setDocs(data.documents);
      setUploadStatus("success");
      setUploadStep(0);
      setUploadMsg(`Indexed ${data.chunkCount} chunks from 3 patient records`);
      setShowDropzone(false);
      setShowMobileDocs(false);
      setMessages([{
        role: "assistant",
        content: `3 AI-generated patient records indexed (${data.chunkCount} chunks) — covering T2DM/CKD, CAD/HFrEF, and metabolic syndrome. Try one of the suggested questions or ask about a specific patient.`,
      }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      setUploadStatus("error");
      setUploadStep(0);
      setUploadMsg(err instanceof Error ? err.message : "Failed to generate sample data");
    }
  }, [embedText]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach(processFile);
  }, [processFile]);

  const clearAll = async () => {
    await fetch("/api/embeddings", { method: "DELETE" });
    setDocs([]);
    setUploadStatus("idle");
    setUploadMsg("");
    setMessages([]);
    setShowDropzone(true);
  };

  const copyMsg = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const send = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q || chatLoading || !hasDocuments) return;
    setInput("");

    const history = messages
      .filter(m => m.role === "user" || (m.role === "assistant" && m.result !== undefined))
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev,
      { role: "user", content: q },
      { role: "assistant", content: "", streaming: true },
    ]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(part.slice(6));

            if (data.t === "d") {
              setMessages(prev => {
                const msgs = [...prev];
                const last = msgs[msgs.length - 1];
                if (last?.role === "assistant" && last.streaming) {
                  msgs[msgs.length - 1] = { ...last, content: last.content + data.v };
                }
                return msgs;
              });

            } else if (data.t === "r") {
              const isSessionReset =
                data.sources.length === 0 &&
                data.confidence === 0 &&
                docsRef.current.length > 0;

              if (isSessionReset) {
                setDocs([]);
                setUploadStatus("idle");
                setUploadMsg("");
                setShowDropzone(true);
                setMessages(prev => {
                  const msgs = [...prev];
                  msgs[msgs.length - 1] = {
                    role: "assistant",
                    content: "Your session was reset — the server restarted and cleared your indexed documents. Please re-index to continue.",
                  };
                  return msgs;
                });
              } else {
                setMessages(prev => {
                  const msgs = [...prev];
                  msgs[msgs.length - 1] = {
                    role: "assistant",
                    content: data.answer,
                    result: { answer: data.answer, sources: data.sources, confidence: data.confidence },
                    streaming: false,
                  };
                  return msgs;
                });
              }
            }
          } catch {
            // Skip malformed SSE events
          }
        }
      }
    } catch {
      setMessages(prev => {
        const msgs = [...prev];
        if (msgs[msgs.length - 1]?.streaming) {
          msgs[msgs.length - 1] = { role: "assistant", content: "Request failed. Check your API key." };
        }
        return msgs;
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:h-full overflow-hidden">
      {/* Left panel: Documents */}
      <div className="md:w-72 w-full shrink-0 md:border-r border-b md:border-b-0 border-slate-700/50 flex flex-col bg-slate-900/40 md:overflow-y-auto">
        {/* Mobile toggle header */}
        <button
          className="md:hidden flex items-center justify-between w-full p-4 border-b border-slate-700/50 text-left"
          onClick={() => setShowMobileDocs(v => !v)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Documents</span>
            {docs.length > 0 && (
              <span className="text-[10px] bg-sky-900/60 text-sky-300 px-1.5 py-0.5 rounded">
                {docs.length} indexed
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showMobileDocs ? "rotate-180" : ""}`} />
        </button>

        {/* Desktop header */}
        <div className="hidden md:block p-4 border-b border-slate-700/50">
          <h2 className="text-sm font-semibold text-white">Documents</h2>
          <p className="text-xs text-slate-500 mt-0.5">Session-only — not stored</p>
        </div>

        {/* Content */}
        <div className={`p-4 space-y-3 flex-1 ${showMobileDocs ? "block" : "hidden md:block"}`}>
          <button
            onClick={loadSample}
            disabled={uploadStatus === "processing"}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors"
          >
            {uploadStatus === "processing"
              ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              : <FlaskConical className="w-4 h-4 shrink-0" />}
            Try Sample Data
          </button>

          {hasDocuments && !showDropzone ? (
            <button
              onClick={() => setShowDropzone(true)}
              className="w-full flex items-center gap-2 px-3 py-2 border border-slate-700 hover:border-slate-500 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add more files
            </button>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                isDragging ? "border-sky-400 bg-sky-500/10" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/40"
              }`}
            >
              <Upload className="w-6 h-6 mx-auto mb-2 text-slate-500" />
              <p className="text-xs text-slate-400">Drop a file or click</p>
              <p className="text-xs text-slate-600 mt-0.5">PDF, TXT, MD</p>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.md,.text" multiple className="hidden"
                onChange={e => handleFiles(e.target.files)} />
            </div>
          )}

          {uploadStatus !== "idle" && (
            <div className={`px-3 py-2.5 rounded-lg text-xs ${
              uploadStatus === "processing" ? "bg-slate-800 text-slate-300"
              : uploadStatus === "success" ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40"
              : "bg-red-900/40 text-red-300 border border-red-700/40"
            }`}>
              <div className="flex items-start gap-2">
                {uploadStatus === "processing" && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />}
                {uploadStatus === "success" && <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                {uploadStatus === "error" && <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                <span>{uploadMsg}</span>
              </div>
              {uploadStatus === "processing" && (
                <div className="flex gap-1 mt-2 ml-5">
                  {uploadStepLabels.map((label, i) => (
                    <div key={label} className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        uploadStep > i + 1 ? "bg-sky-400"
                        : uploadStep === i + 1 ? "bg-sky-400 animate-pulse"
                        : "bg-slate-600"
                      }`} />
                      <span className={`text-[10px] ${uploadStep >= i + 1 ? "text-sky-400" : "text-slate-600"}`}>
                        {label}
                      </span>
                      {i < 2 && <span className="text-slate-700 text-[10px]">›</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {docs.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Indexed</span>
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
              {docs.map(doc => (
                <div key={doc.source} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                  <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-xs text-slate-300 truncate flex-1">{doc.source}</span>
                  <span className="text-xs text-slate-600 shrink-0">{doc.chunkCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Chat */}
      <div className="flex-1 flex flex-col min-w-0 min-h-[60vh] md:min-h-0">
        {!hasDocuments ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium">No documents loaded</p>
            <p className="text-slate-500 text-sm mt-1">Upload a file or click <button onClick={loadSample} className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors">Try Sample Data</button> to start</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] md:max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-200 border border-slate-700/50"
                  }`}>
                    {msg.result && (
                      <div className="mb-2"><ConfidenceBadge score={msg.result.confidence} /></div>
                    )}
                    <p className="whitespace-pre-wrap">
                      {msg.content}
                      {msg.streaming && <span className="animate-pulse ml-0.5">▋</span>}
                    </p>
                    {msg.result && <SourcesAccordion result={msg.result} />}
                    {msg.role === "assistant" && msg.result && (
                      <button
                        onClick={() => copyMsg(msg.content, i)}
                        className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                        title="Copy answer"
                      >
                        {copiedIdx === i
                          ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                          : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && !chatLoading && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTED.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs px-3 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="px-4 md:px-6 pb-5 pt-3 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Ask a clinical question…"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || chatLoading}
                  className="px-4 py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
