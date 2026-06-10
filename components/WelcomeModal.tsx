"use client";

import { useEffect, useState } from "react";
import { X, BookOpen, FlaskConical, Upload, Mic, FileText, Sparkles } from "lucide-react";

const STORAGE_KEY = "docturlama_welcome_seen";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {}
  }, []);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden">
        {/* header band */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-white shrink-0" />
              <div>
                <h2 className="text-white font-semibold text-lg leading-tight">Welcome to DocturLama</h2>
                <p className="text-sky-100 text-sm mt-0.5">Healthcare RAG Assistant — a learning demo</p>
              </div>
            </div>
            <button
              onClick={dismiss}
              className="text-white/70 hover:text-white transition-colors shrink-0 mt-0.5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* what I was exploring */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                What this demo explores
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              I built this to learn how <span className="font-medium text-slate-800 dark:text-slate-200">Retrieval-Augmented Generation (RAG)</span> works in practice — specifically in a domain where accuracy matters. The app ingests medical documents, chunks and indexes them in-memory, then uses Claude AI to answer questions grounded in those sources. It also experiments with <span className="font-medium text-slate-800 dark:text-slate-200">multimodal input</span>, <span className="font-medium text-slate-800 dark:text-slate-200">structured note enhancement</span>, and <span className="font-medium text-slate-800 dark:text-slate-200">LLM-as-judge evaluations</span>.
            </p>
          </div>

          {/* divider */}
          <div className="border-t border-slate-100 dark:border-slate-800" />

          {/* next steps */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                Try it yourself
              </h3>
            </div>
            <ul className="space-y-2.5">
              {[
                {
                  icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
                  label: "Generate sample data",
                  desc: 'Click "Generate Sample" on the Upload page to create a synthetic patient record — no real data needed.',
                },
                {
                  icon: <Upload className="w-4 h-4 text-sky-500" />,
                  label: "Upload your own documents",
                  desc: "Drop in any PDF or text file (discharge summary, lab report, etc.) and ask questions about it.",
                },
                {
                  icon: <FileText className="w-4 h-4 text-indigo-500" />,
                  label: "Enhance a doctor note",
                  desc: 'Head to the "Enhance" tab, paste a rough note, and see structured suggestions appear inline.',
                },
                {
                  icon: <Mic className="w-4 h-4 text-rose-500" />,
                  label: "Try voice or image input",
                  desc: 'The "Multimodal" tab lets you speak a query or upload an image (e.g., a photo of handwritten notes).',
                },
              ].map(({ icon, label, desc }) => (
                <li key={label} className="flex gap-3">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label} — </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* footer note */}
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
            All data is session-only and cleared on inactivity or tab close — nothing is stored server-side.
          </p>

          <button
            onClick={dismiss}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Let&apos;s explore →
          </button>
        </div>
      </div>
    </div>
  );
}
