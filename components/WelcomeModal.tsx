"use client";

import { useState, useEffect } from "react";
import { X, FlaskConical, BookOpen, ShieldCheck, Zap } from "lucide-react";

interface WelcomeModalProps {
  onTrySample: () => void;
}

export default function WelcomeModal({ onTrySample }: WelcomeModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("docturlama-welcome-seen")) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("docturlama-welcome-seen", "1");
    setVisible(false);
  };

  const handleTrySample = () => {
    dismiss();
    onTrySample();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hey, welcome to DocturLama</h2>
          <button onClick={dismiss} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 ml-3 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Here’s why I built it and what I was trying to learn.</p>

        <div className="space-y-3 mb-5">
          {[
            {
              icon: BookOpen,
              heading: "RAG from scratch",
              body: "I wanted to build a full retrieval-augmented generation pipeline without a framework — chunking, TF-IDF embeddings, cosine similarity retrieval, and grounded generation with source citations. No LangChain, no LlamaIndex.",
            },
            {
              icon: Zap,
              heading: "Claude API in depth",
              body: "Streaming responses, tool-free structured output, Claude Vision for medical images, Haiku for cheap fast tasks (guardrails, sample generation), and Sonnet-as-judge for automated evals.",
            },
            {
              icon: ShieldCheck,
              heading: "HIPAA-conscious design",
              body: "Zero persistence architecture — no data written to disk, 15-minute inactivity auto-clear, input guardrails for PII, and an in-browser embedding model so patient records never leave the session.",
            },
          ].map(({ icon: Icon, heading, body }) => (
            <div key={heading} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{heading}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-700/50 rounded-xl px-4 py-3 mb-5">
          <p className="text-sm text-sky-700 dark:text-sky-300 leading-relaxed">
            <strong className="text-sky-800 dark:text-sky-200">Best starting point:</strong>{" "}
            hit <strong className="text-sky-800 dark:text-sky-200">Try Sample Data</strong> — it uses AI to generate three realistic longitudinal patient records and indexes them instantly, so you can ask clinical questions right away without uploading anything.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleTrySample}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
            Try Sample Data
          </button>
          <button
            onClick={dismiss}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-sm transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
