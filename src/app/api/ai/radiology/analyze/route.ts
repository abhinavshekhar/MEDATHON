import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const confidence = Math.round((0.62 + Math.random() * 0.28) * 100) / 100;

  return NextResponse.json({
    visit_id: body.visit_id ?? "V-DEMO",
    patient_id: body.patient_id ?? "demo",
    status: "completed",
    confidence,
    finding:
      "Patchy opacities in bilateral lower lung zones, more pronounced on the right. " +
      "Pattern may represent inflammatory or infectious process. " +
      "Recommend clinical correlation with vitals, SpO2, and symptoms. " +
      "No pleural effusion detected on this view.",
    model: "DenseNet121-GradCAM",
    processing_ms: 1180,
    heatmap_available: true,
    heatmap_url: null,
  });
}
