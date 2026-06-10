"use client";
import { ShieldCheck } from "lucide-react";

export default function HipaaBanner() {
  return (
    <div className="md:hidden w-full bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 py-1.5 flex items-center gap-1.5 text-slate-400 dark:text-slate-600 text-[11px]">
      <ShieldCheck className="w-3 h-3 shrink-0" />
      <span>HIPAA — session-only storage, no PHI transmitted</span>
    </div>
  );
}
