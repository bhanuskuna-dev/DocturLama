"use client";

import { useState } from "react";
import { Loader2, CheckCircle, XCircle, Wand2, Copy, Download, Check } from "lucide-react";
import { NoteSuggestion } from "@/lib/types";

const SAMPLE_NOTE = `Patient: J.D., 58M
CC: Chest pain x 2 hrs
PMH: HTN, DM2, smoker
Vitals: BP 158/92, HR 88, O2 98%
PE: Mild SOB, no JVD, lungs CTA
Impression: R/O ACS
Plan: EKG, troponin, admit for obs`;

export default function EnhancePage() {
  const [note, setNote] = useState(SAMPLE_NOTE);
  const [suggestions, setSuggestions] = useState<NoteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  const enhance = async () => {
    setLoading(true);
    setSuggestions([]);
    setApplied(false);
    try {
      const res = await fetch("/api/enhance-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions.map((s: NoteSuggestion) => ({ ...s, accepted: undefined })));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const decide = (idx: number, accept: boolean) => {
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, accepted: accept } : s)));
  };

  const applyAccepted = () => {
    let lines = note.split("\n");
    const accepted = suggestions
      .filter((s) => s.accepted === true)
      .sort((a, b) => b.lineRange[0] - a.lineRange[0]);
    for (const s of accepted) {
      const [start, end] = s.lineRange;
      lines.splice(start - 1, end - start + 1, ...s.suggested.split("\n"));
    }
    setNote(lines.join("\n"));
    setSuggestions([]);
    setApplied(true);
  };

  const copyNote = async () => {
    await navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadNote = () => {
    const blob = new Blob([note], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clinical-note-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingCount = suggestions.filter((s) => s.accepted === undefined).length;
  const acceptedCount = suggestions.filter((s) => s.accepted === true).length;
  const wordCount = note.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-1">Doctor Note Enhancer</h1>
      <p className="text-slate-400 text-sm mb-8">
        Paste a clinical note. Claude will suggest targeted improvements — accept or reject each one.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Note editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Clinical Note
            </label>
            <span className="text-xs text-slate-600">{wordCount} words</span>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={18}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-sky-500 resize-none transition-colors"
            placeholder="Paste clinical note here…"
          />

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={enhance}
              disabled={loading || !note.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-white transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {loading ? "Analyzing…" : "Suggest Enhancements"}
            </button>

            {note.trim() && (
              <>
                <button
                  onClick={copyNote}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Copy note to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={downloadNote}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Download as .txt"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </>
            )}
          </div>

          {applied && (
            <p className="mt-2 text-sm text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Accepted suggestions applied.
            </p>
          )}
        </div>

        {/* Suggestions panel */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Suggestions {suggestions.length > 0 && `(${suggestions.length})`}
            </label>
            {acceptedCount > 0 && pendingCount === 0 && (
              <button
                onClick={applyAccepted}
                className="text-xs px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-white transition-colors"
              >
                Apply {acceptedCount} accepted
              </button>
            )}
          </div>

          {suggestions.length === 0 && !loading && (
            <div className="flex items-center justify-center h-64 rounded-xl border border-dashed border-slate-700 text-slate-600 text-sm">
              Suggestions will appear here
            </div>
          )}

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 transition-colors ${
                  s.accepted === true
                    ? "border-emerald-700/60 bg-emerald-900/20"
                    : s.accepted === false
                    ? "border-slate-700/30 bg-slate-900/30 opacity-50"
                    : "border-slate-700/50 bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-sky-400 font-medium">
                    Lines {s.lineRange[0]}–{s.lineRange[1]}
                  </span>
                  {s.accepted === undefined && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => decide(idx, true)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-800/60 hover:bg-emerald-700/60 text-emerald-300 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" /> Accept
                      </button>
                      <button
                        onClick={() => decide(idx, false)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-700/60 hover:bg-slate-600/60 text-slate-400 transition-colors"
                      >
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  )}
                  {s.accepted === true && <span className="text-xs text-emerald-400">Accepted</span>}
                  {s.accepted === false && <span className="text-xs text-slate-500">Rejected</span>}
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Original:</span>
                    <span className="text-red-300/80 bg-red-900/20 px-2 py-1 rounded block whitespace-pre-wrap">{s.original}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Suggested:</span>
                    <span className="text-emerald-300/90 bg-emerald-900/20 px-2 py-1 rounded block whitespace-pre-wrap">{s.suggested}</span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-400 italic">{s.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
