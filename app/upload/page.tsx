"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader2, FlaskConical } from "lucide-react";
import { SAMPLE_DOCUMENT_NAME, SAMPLE_DOCUMENT_TEXT } from "@/lib/sampleData";

interface DocEntry {
  source: string;
  chunkCount: number;
}

export default function UploadPage() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
    setStatus("processing");
    setMessage(`Processing ${file.name}…`);
    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
        if (!res.ok) throw new Error("PDF parsing failed");
        const data = await res.json();
        text = data.text;
      } else {
        text = await file.text();
      }
      const data = await embedText(text, file.name);
      setDocs(data.documents);
      setStatus("success");
      setMessage(`Indexed ${data.chunkCount} chunks from ${file.name}`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }, [embedText]);

  const loadSample = useCallback(async () => {
    setStatus("processing");
    setMessage("Loading sample clinical reference — indexing 7 specialties…");
    try {
      const data = await embedText(SAMPLE_DOCUMENT_TEXT, SAMPLE_DOCUMENT_NAME);
      setDocs(data.documents);
      setStatus("success");
      setMessage(`Indexed ${data.chunkCount} chunks from sample document. Try asking a clinical question.`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to load sample data");
    }
  }, [embedText]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      Array.from(files).forEach((f) => processFile(f));
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const clearAll = async () => {
    await fetch("/api/embeddings", { method: "DELETE" });
    setDocs([]);
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-1">Document Upload</h1>
      <p className="text-slate-400 text-sm mb-8">
        Upload PDF or plain-text medical documents. Documents are chunked into 500-token segments
        with 100-token overlap and indexed in-memory for retrieval.
      </p>

      {/* Try Sample Data banner */}
      <div className="mb-6 flex items-center justify-between bg-sky-950/60 border border-sky-700/50 rounded-xl px-5 py-4">
        <div>
          <p className="text-sky-200 text-sm font-medium">No documents yet?</p>
          <p className="text-sky-400/70 text-xs mt-0.5">
            Load a 7-specialty clinical reference — cardiology, critical care, pharmacology, neurology &amp; more.
          </p>
        </div>
        <button
          onClick={loadSample}
          disabled={status === "processing"}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors shrink-0 ml-4"
        >
          {status === "processing" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FlaskConical className="w-4 h-4" />
          )}
          Try Sample Data
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-sky-400 bg-sky-500/10"
            : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/50"
        }`}
      >
        <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
        <p className="text-slate-300 font-medium">Drop files here or click to browse</p>
        <p className="text-slate-500 text-sm mt-1">PDF, TXT, MD — session-only storage</p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt,.md,.text"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Status */}
      {status !== "idle" && (
        <div
          className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
            status === "processing"
              ? "bg-slate-800 text-slate-300"
              : status === "success"
              ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50"
              : "bg-red-900/40 text-red-300 border border-red-700/50"
          }`}
        >
          {status === "processing" && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === "success" && <CheckCircle className="w-4 h-4" />}
          {status === "error" && <AlertCircle className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* Document list */}
      {docs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              Indexed Documents ({docs.length})
            </h2>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div
                key={doc.source}
                className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-slate-200 text-sm truncate max-w-xs">{doc.source}</span>
                </div>
                <span className="text-xs text-slate-500 shrink-0 ml-4">
                  {doc.chunkCount} chunks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
