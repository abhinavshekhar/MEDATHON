import { NextRequest, NextResponse } from "next/server";
import {
  extractJsonFromText,
  getGeminiModel,
  isGeminiConfigured,
  parseImageInput,
} from "@/lib/gemini";

export const dynamic = "force-dynamic";

const RADIOLOGY_PROMPT = `Analyse this chest X-ray for a clinical assist demo at an Indian urban health centre.
Return ONLY valid JSON:
- finding (string, assistive interpretation)
- confidence (number 0-1)
- regions (array of strings)
- recommendation (string)
Clinician review required. Do not give definitive diagnosis.`;

function demoResult(visitId: string, patientId: string) {
  const confidence = Math.round((0.62 + Math.random() * 0.28) * 100) / 100;
  return {
    visit_id: visitId,
    patient_id: patientId,
    status: "completed",
    confidence,
    finding:
      "Patchy opacities in bilateral lower lung zones, more pronounced on the right. " +
      "Pattern may represent inflammatory or infectious process. " +
      "Recommend clinical correlation with vitals, SpO2, and symptoms. " +
      "Demo mode — add GEMINI_API_KEY for live Gemini Vision.",
    regions: ["Right lower zone", "Left lower zone"],
    recommendation: "Correlate with examination; repeat imaging if clinically indicated.",
    model: "demo-fallback",
    processing_ms: 1200,
    heatmap_available: true,
    heatmap_url: null,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const visitId = body.visit_id ?? "V-DEMO";
  const patientId = body.patient_id ?? "demo";
  const image = parseImageInput(body);

  if (!image) {
    return NextResponse.json(demoResult(visitId, patientId));
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json(demoResult(visitId, patientId));
  }

  try {
    const model = getGeminiModel();
    if (!model) {
      return NextResponse.json(demoResult(visitId, patientId));
    }

    const start = Date.now();
    const result = await model.generateContent([
      RADIOLOGY_PROMPT,
      { inlineData: { mimeType: image.mimeType, data: image.data } },
    ]);
    const parsed = extractJsonFromText(result.response.text());
    const processing_ms = Date.now() - start;

    const confidence = typeof parsed?.confidence === "number" ? parsed.confidence : 0.75;
    const finding =
      typeof parsed?.finding === "string"
        ? parsed.finding
        : result.response.text().slice(0, 500);

    return NextResponse.json({
      visit_id: visitId,
      patient_id: patientId,
      status: "completed",
      confidence,
      finding,
      regions: parsed?.regions ?? [],
      recommendation: parsed?.recommendation ?? "Clinical correlation recommended.",
      model: `Gemini Vision (${process.env.GEMINI_MODEL ?? "gemini-2.0-flash"})`,
      processing_ms,
      heatmap_available: true,
      heatmap_url: null,
    });
  } catch {
    return NextResponse.json(demoResult(visitId, patientId));
  }
}
