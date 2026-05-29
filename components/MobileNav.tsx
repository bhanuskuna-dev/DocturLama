"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, FileEdit, Camera, BarChart2 } from "lucide-react";

const nav = [
  { href: "/upload", label: "Chat", icon: MessageSquare },
  { href: "/enhance", label: "Notes", icon: FileEdit },
  { href: "/multimodal", label: "Image", icon: Camera },
  { href: "/evals", label: "Evals", icon: BarChart2 },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-700/50 flex z-40">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 gap-1 text-[10px] transition-colors ${
              active ? "text-sky-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
