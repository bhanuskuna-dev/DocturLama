import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); }

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType, question } = await req.json();

    if (!imageBase64 || !question) {
      return NextResponse.json({ error: "imageBase64 and question are required" }, { status: 400 });
    }

    const validMime = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const mime = validMime.includes(mimeType) ? mimeType : "image/jpeg";

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: "You are a clinical imaging and medical document analysis assistant. Provide precise, evidence-based observations. Do not diagnose — describe findings and suggest clinical correlation.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mime as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            { type: "text", text: question },
          ],
        },
      ],
    });

    const analysis = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Image analysis error:", err);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
