import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, isGeminiConfigured } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const visitId = body.visit_id ?? "V-DEMO";
  const historyText = String(body.history_text ?? body.text ?? "").trim();

  if (!historyText) {
    return NextResponse.json({
      visit_id: visitId,
      status: "error",
      message: "history_text required",
      summary: null,
    }, { status: 400 });
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json({
      visit_id: visitId,
      status: "completed",
      model: "demo-fallback",
      summary: `Visit summary (demo): ${historyText.slice(0, 200)}… Add GEMINI_API_KEY for AI-generated clinical summaries.`,
    });
  }

  try {
    const model = getGeminiModel();
    if (!model) throw new Error("Gemini unavailable");

    const prompt = `Summarize this patient visit history for a doctor in Chennai clinic. Be concise (3-5 bullet points), plain English, assistive only:\n\n${historyText}`;
    const start = Date.now();
    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    return NextResponse.json({
      visit_id: visitId,
      status: "completed",
      model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
      processing_ms: Date.now() - start,
      summary,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Summary failed";
    return NextResponse.json({ visit_id: visitId, status: "error", message: msg, summary: null }, { status: 500 });
  }
}
