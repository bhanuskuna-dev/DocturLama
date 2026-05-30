"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, FileEdit, Camera, BarChart2, Activity, BookOpen } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/upload", label: "Documents & Chat", icon: MessageSquare },
  { href: "/enhance", label: "Note Enhancer", icon: FileEdit },
  { href: "/multimodal", label: "Image & Voice", icon: Camera },
  { href: "/evals", label: "AI Evals", icon: BarChart2 },
  { href: "/prd", label: "Privacy & PRD", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 shrink-0 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 flex-col">
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-500 dark:text-sky-400" />
          <span className="text-slate-900 dark:text-white font-semibold tracking-tight">DocturLama</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sky-500/20 text-sky-600 dark:text-sky-300 font-medium"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700/50 text-xs text-slate-400 dark:text-slate-600">
        Session-only storage
      </div>
    </aside>
  );
}
