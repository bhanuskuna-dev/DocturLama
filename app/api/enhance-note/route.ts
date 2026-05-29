import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { NoteSuggestion } from "@/lib/types";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); }

export async function POST(req: NextRequest) {
  try {
    const { note } = await req.json();

    if (!note || typeof note !== "string") {
      return NextResponse.json({ error: "note is required" }, { status: 400 });
    }

    const lines = note.split("\n");

    const systemPrompt = `You are a clinical documentation specialist. Your task is to improve doctor notes for clarity, completeness, and compliance.
Return ONLY a valid JSON array of suggestion objects. No markdown, no explanation outside the JSON.
Each object must have: lineRange ([startLine, endLine] 1-indexed), original (the original text), suggested (improved text), reason (brief explanation).
Focus on: medical terminology precision, SOAP note structure, missing clinical details, abbreviation clarity, and documentation standards.`;

    const userPrompt = `Improve the following clinical note. Return a JSON array of targeted suggestions.\n\nNote (${lines.length} lines):\n${note}`;

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "[]";

    let suggestions: NoteSuggestion[];
    try {
      const cleaned = raw.replace(/^```(?:json)?\n?|\n?```$/g, "").trim();
      suggestions = JSON.parse(cleaned);
    } catch {
      suggestions = [];
    }

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("Enhance note error:", err);
    return NextResponse.json({ error: "Failed to enhance note" }, { status: 500 });
  }
}
