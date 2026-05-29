"use client";

import { useState, useEffect } from "react";
import { GOLDEN_DATASET } from "@/lib/evaluations";
import { EvalResult } from "@/lib/types";
import { Play, Loader2, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";

function ScoreBadge({ score, max = 10 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color =
    pct >= 75 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50"
    : pct >= 50 ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/50"
    : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50";
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${color}`}>
      {score}/{max}
    </span>
  );
}

export default function EvalsPage() {
  const [results, setResults] = useState<EvalResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hasDocs, setHasDocs] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/embeddings")
      .then(r => r.json())
      .then(d => setHasDocs(Array.isArray(d.documents) && d.documents.length > 0))
      .catch(() => setHasDocs(false));
  }, []);

  const runAll = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/evals", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const avgRelevance = results.length
    ? (results.reduce((s, r) => s + r.relevanceScore, 0) / results.length).toFixed(1)
    : null;
  const avgAccuracy = results.length
    ? (results.reduce((s, r) => s + r.accuracyScore, 0) / results.length).toFixed(1)
    : null;
  const avgConfidence = results.length
    ? Math.round((results.reduce((s, r) => s + r.confidence, 0) / results.length) * 100)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {hasDocs === false && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/50 rounded-xl text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-amber-700 dark:text-amber-300 font-medium">No documents indexed.</span>
            <span className="text-amber-600 dark:text-amber-400/80 ml-1">
              Eval questions will retrieve no context and scores will be low. Load sample data on the{" "}
              <a href="/upload" className="underline hover:text-amber-800 dark:hover:text-amber-300 transition-colors">Documents &amp; Chat</a> page first.
            </span>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Evals Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {GOLDEN_DATASET.length}-pair golden dataset. Runs each question through the RAG pipeline and scores with Claude as judge.
          </p>
        </div>
        <button
          onClick={runAll}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-white transition-colors shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? "Running evals…" : "Run All Evals"}
        </button>
      </div>

      {/* Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Avg Relevance", value: `${avgRelevance}/10`, icon: TrendingUp },
            { label: "Avg Accuracy", value: `${avgAccuracy}/10`, icon: CheckCircle },
            { label: "Avg Confidence", value: `${avgConfidence}%`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-sky-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
              </div>
              <span className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dataset / Results table */}
      <div className="space-y-3">
        {(results.length > 0 ? results : GOLDEN_DATASET.map((p) => ({ ...p, actualAnswer: "", relevanceScore: 0, accuracyScore: 0, retrievedSources: 0, confidence: 0 }))).map((item) => {
          const hasResult = results.some((r) => r.id === item.id);
          const r = results.find((r) => r.id === item.id);
          const isExp = expanded === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isExp ? null : item.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono shrink-0">{item.id}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{item.question}</span>
                </div>
                {hasResult && r && (
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <ScoreBadge score={r.relevanceScore} />
                    <ScoreBadge score={r.accuracyScore} />
                  </div>
                )}
              </button>

              {isExp && (
                <div className="border-t border-slate-200 dark:border-slate-700/50 px-4 py-4 space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Question</span>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{item.question}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Expected Answer</span>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{"expectedAnswer" in item ? item.expectedAnswer : ""}</p>
                  </div>
                  {hasResult && r && (
                    <>
                      <div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Actual Answer</span>
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{r.actualAnswer}</p>
                      </div>
                      <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>Relevance: <strong className="text-slate-700 dark:text-slate-200">{r.relevanceScore}/10</strong></span>
                        <span>Accuracy: <strong className="text-slate-700 dark:text-slate-200">{r.accuracyScore}/10</strong></span>
                        <span>Confidence: <strong className="text-slate-700 dark:text-slate-200">{Math.round(r.confidence * 100)}%</strong></span>
                        <span>Sources: <strong className="text-slate-700 dark:text-slate-200">{r.retrievedSources}</strong></span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
