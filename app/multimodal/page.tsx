"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, ImagePlus, Send, Loader2, X } from "lucide-react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognitionInstance };
    webkitSpeechRecognition: { new (): SpeechRecognitionInstance };
  }
}

interface Message {
  role: "user" | "assistant";
  content: string;
  imageSrc?: string;
}

export default function MultimodalPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    rec.onend = () => setIsRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setIsRecording(true);
  }, []);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const handleImageFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      const base64 = result.split(",")[1];
      setImageBase64(base64);
      setImageMime(file.type || "image/jpeg");
    };
    reader.readAsDataURL(file);
  }, []);

  const send = async () => {
    const q = input.trim();
    if ((!q && !imageBase64) || loading) return;

    const userMsg: Message = {
      role: "user",
      content: q || "Analyze this image",
      imageSrc: imagePreview ?? undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const capturedImage = imageBase64;
    const capturedMime = imageMime;
    setImagePreview(null);
    setImageBase64(null);
    setLoading(true);

    try {
      if (capturedImage) {
        const res = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: capturedImage,
            mimeType: capturedMime,
            question: q || "Describe the clinical findings in this image.",
          }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.analysis || data.error }]);
      } else {
        const res = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Request failed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Multimodal Input</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Text, voice, or image input. Voice uses the Web Speech API; images are analyzed by Claude Vision.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
            Start a conversation with text, voice, or an image.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-200 border border-slate-700/50"
              }`}
            >
              {msg.imageSrc && (
                <img
                  src={msg.imageSrc}
                  alt="Uploaded medical image"
                  className="rounded-lg mb-2 max-h-48 object-contain"
                />
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative inline-block mb-3">
          <img src={imagePreview} alt="Preview" className="h-20 rounded-lg object-contain border border-slate-700" />
          <button
            onClick={() => { setImagePreview(null); setImageBase64(null); }}
            className="absolute -top-1.5 -right-1.5 bg-slate-700 hover:bg-slate-600 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3 text-slate-300" />
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-2 pt-4 border-t border-slate-800">
        <button
          onClick={() => fileRef.current?.click()}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Upload image"
        >
          <ImagePlus className="w-4 h-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
        />

        <button
          onClick={isRecording ? stopVoice : startVoice}
          className={`p-3 rounded-xl transition-colors ${
            isRecording
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
          }`}
          title={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={isRecording ? "Listening…" : "Type or speak a clinical question, or upload an image…"}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
        />

        <button
          onClick={send}
          disabled={(!input.trim() && !imageBase64) || loading}
          className="px-4 py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
