import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import HipaaBanner from "@/components/HipaaBanner";
import InactivityGuard from "@/components/InactivityGuard";
import MobileNav from "@/components/MobileNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import WelcomeModal from "@/components/WelcomeModal";

export const metadata: Metadata = {
  title: "DocturLama — Healthcare RAG Assistant",
  description: "Clinical decision support powered by RAG and Claude AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()` }} />
      </head>
      <body className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <HipaaBanner />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-14 md:pb-0">{children}</main>
          </div>
          <WelcomeModal />
          <InactivityGuard />
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
