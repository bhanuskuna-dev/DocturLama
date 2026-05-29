"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Clock, X } from "lucide-react";

const TIMEOUT_MS = 15 * 60 * 1000;
const WARNING_MS = 14 * 60 * 1000;

export default function InactivityGuard() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const countdownRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const clearSession = useCallback(async () => {
    await fetch("/api/embeddings", { method: "DELETE" }).catch(() => {});
    setShowWarning(false);
    window.location.href = "/upload";
  }, []);

  const resetTimers = useCallback(() => {
    setShowWarning(false);
    clearInterval(countdownRef.current);
    clearTimeout(warningTimerRef.current);
    clearTimeout(clearTimerRef.current);

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(60);
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { clearInterval(countdownRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_MS);

    clearTimerRef.current = setTimeout(clearSession, TIMEOUT_MS);
  }, [clearSession]);

  useEffect(() => {
    const events = ["mousedown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimers, { passive: true }));
    resetTimers();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimers));
      clearTimeout(warningTimerRef.current);
      clearTimeout(clearTimerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [resetTimers]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-amber-50 dark:bg-amber-950/95 border border-amber-200 dark:border-amber-700/60 rounded-xl px-5 py-4 shadow-2xl max-w-sm backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-700 dark:text-amber-200 text-sm font-medium">Session expiring</p>
            <p className="text-amber-600 dark:text-amber-400/80 text-xs mt-0.5 leading-relaxed">
              Session will be cleared in <span className="font-mono font-bold">{timeLeft}s</span> due to inactivity.
              All in-session data will be removed.
            </p>
          </div>
        </div>
        <button onClick={() => setShowWarning(false)} className="text-amber-500 dark:text-amber-600 hover:text-amber-700 dark:hover:text-amber-400 transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={resetTimers}
          className="flex-1 text-xs px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors font-medium"
        >
          Stay active
        </button>
        <button
          onClick={clearSession}
          className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
        >
          Clear now
        </button>
      </div>
    </div>
  );
}
