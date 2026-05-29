import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import HipaaBanner from "@/components/HipaaBanner";
import InactivityGuard from "@/components/InactivityGuard";

export const metadata: Metadata = {
  title: "DocturLama — Healthcare RAG Assistant",
  description: "Clinical decision support powered by RAG and Claude AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-slate-950 text-slate-100">
        <HipaaBanner />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-slate-950">{children}</main>
        </div>
        <InactivityGuard />
      </body>
    </html>
  );
}
