import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamically import pdfjs to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;

    const textParts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? (item as { str: string }).str : ""))
        .join(" ");
      textParts.push(pageText);
    }

    const text = textParts.join("\n\n");
    return NextResponse.json({ text, pages: pdf.numPages });
  } catch (err) {
    console.error("PDF parse error:", err);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
