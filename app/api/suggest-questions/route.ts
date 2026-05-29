import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function POST(req: NextRequest) {
  const { text } = await req.json() as { text: string };
  if (!text) return Response.json({ questions: [] }, { status: 400 });

  try {
    const message = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{
        role: "user",
        content: `Based on the medical records below, generate exactly 5 specific clinical questions that probe key findings, diagnoses, medication choices, or lab trends found in these notes. Reference specific patient names, values, or drugs where possible.

Respond with ONLY a JSON array of 5 strings — no markdown, no explanation, no trailing text:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]

Medical records (excerpt):
${text.slice(0, 4000)}`,
      }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "[]";
    const match = raw.match(/\[[\s\S]*\]/);
    const questions: string[] = match ? JSON.parse(match[0]) : [];

    return Response.json({ questions: questions.slice(0, 5) });
  } catch (err) {
    console.error("Suggest questions error:", err);
    return Response.json({ questions: [] });
  }
}
