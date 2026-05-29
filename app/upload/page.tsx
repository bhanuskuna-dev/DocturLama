"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader2,
  FlaskConical, Send, ChevronDown, ChevronUp, Plus, X
} from "lucide-react";
import { SAMPLE_DOCUMENT_NAME, SAMPLE_DOCUMENT_TEXT } from "@/lib/sampleData";
import { QueryResult } from "@/lib/types";

interface DocEntry { source: string; chunkCount: number; }
interface Message {
  role: "user" | "assistant";
  content: string;
  result?: QueryResult;
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
  const [isDragging, setIsDragging] = useState(false);
  const [showDropzone, setShowDropzone] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasDocuments = docs.length > 0;

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
    setUploadStatus("processing");
    setUploadMsg(`Processing ${file.name}…`);
    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
        if (!res.ok) throw new Error("PDF parsing failed");
        text = (await res.json()).text;
      } else {
        text = await file.text();
      }
      const data = await embedText(text, file.name);
      setDocs(data.documents);
      setUploadStatus("success");
      setUploadMsg(`Indexed ${data.chunkCount} chunks from ${file.name}`);
      setShowDropzone(false);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `${file.name} indexed (${data.chunkCount} chunks). Ask me anything about it.`,
      }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      setUploadStatus("error");
      setUploadMsg(err instanceof Error ? err.message : "Upload failed");
    }
  }, [embedText]);

  const loadSample = useCallback(async () => {
    setUploadStatus("processing");
    setUploadMsg("Indexing 7-specialty clinical reference…");
    try {
      const data = await embedText(SAMPLE_DOCUMENT_TEXT, SAMPLE_DOCUMENT_NAME);
      setDocs(data.documents);
      setUploadStatus("success");
      setUploadMsg(`Indexed ${data.chunkCount} chunks`);
      setShowDropzone(false);
      setMessages([{
        role: "assistant",
        content: `Clinical reference loaded (${data.chunkCount} chunks across cardiology, critical care, pharmacology, neurology, and more). Try one of the suggested questions below, or ask your own.`,
      }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      setUploadStatus("error");
      setUploadMsg(err instanceof Error ? err.message : "Failed to load sample data");
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

  const send = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q || chatLoading || !hasDocuments) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data: QueryResult = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer, result: data }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Request failed. Check your API key." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel: Documents */}
      <div className="w-72 shrink-0 border-r border-slate-700/50 flex flex-col bg-slate-900/40 overflow-y-auto">
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-sm font-semibold text-white">Documents</h2>
          <p className="text-xs text-slate-500 mt-0.5">Session-only — not stored</p>
        </div>

        <div className="p-4 space-y-3 flex-1">
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
            <div className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
              uploadStatus === "processing" ? "bg-slate-800 text-slate-300"
              : uploadStatus === "success" ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/40"
              : "bg-red-900/40 text-red-300 border border-red-700/40"
            }`}>
              {uploadStatus === "processing" && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />}
              {uploadStatus === "success" && <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
              {uploadStatus === "error" && <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
              <span>{uploadMsg}</span>
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
      <div className="flex-1 flex flex-col min-w-0">
        {!hasDocuments ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium">No documents loaded</p>
            <p className="text-slate-500 text-sm mt-1">Upload a file or click <span className="text-sky-400">Try Sample Data</span> to start</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-200 border border-slate-700/50"
                  }`}>
                    {msg.result && (
                      <div className="mb-2"><ConfidenceBadge score={msg.result.confidence} /></div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.result && <SourcesAccordion result={msg.result} />}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Retrieving and generating…
                  </div>
                </div>
              )}

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

            <div className="px-6 pb-5 pt-3 border-t border-slate-800">
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
