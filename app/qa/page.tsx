"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { QueryResult } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  result?: QueryResult;
}

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 75 ? "text-emerald-400 border-emerald-700/50 bg-emerald-900/30"
    : pct >= 50 ? "text-amber-400 border-amber-700/50 bg-amber-900/30"
    : "text-red-400 border-red-700/50 bg-red-900/30";
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${color}`}>
      {pct}% confidence
    </span>
  );
}

function SourcesAccordion({ result }: { result: QueryResult }) {
  const [open, setOpen] = useState(false);
  if (result.sources.length === 0) return null;
  return (
    <div className="mt-3 border border-slate-700/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:bg-slate-800/50 transition-colors"
      >
        <span>{result.sources.length} source{result.sources.length > 1 ? "s" : ""} retrieved</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && (
        <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
          {result.sources.map((src) => (
            <div key={src.label} className="px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-sky-400">{src.label}</span>
                <span className="text-xs text-slate-500">{src.source} · chunk {src.chunkIndex}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{src.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data: QueryResult = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, result: data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Request failed. Check your API keys and document upload.", result: undefined },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Clinical Q&A</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Ask questions about your uploaded medical documents. Answers include source citations and confidence scores.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-slate-500 text-sm">No conversation yet. Upload documents first, then ask a clinical question.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-200 border border-slate-700/50"
              }`}
            >
              {msg.result && (
                <div className="flex items-center gap-2 mb-2">
                  <ConfidenceBadge score={msg.result.confidence} />
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.result && <SourcesAccordion result={msg.result} />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Retrieving and generating…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-slate-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask a clinical question…"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="px-4 py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
