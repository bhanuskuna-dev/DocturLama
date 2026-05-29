"use client";
import { ShieldAlert } from "lucide-react";

export default function HipaaBanner() {
  return (
    <div className="w-full bg-amber-900/40 border-b border-amber-700/50 px-4 py-2 flex items-center gap-2 text-amber-200 text-xs">
      <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
      <span>
        <strong className="text-amber-300">HIPAA Notice:</strong> DocturLama processes data
        in-session only — no PHI is stored, logged, or transmitted beyond your browser session.
        For clinical decisions, always apply professional medical judgment.
      </span>
    </div>
  );
}
