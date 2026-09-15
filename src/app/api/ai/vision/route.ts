import { NextRequest, NextResponse } from "next/server";
import {
  extractJsonFromText,
  getGeminiModel,
  isGeminiConfigured,
  parseImageInput,
} from "@/lib/gemini";

export const dynamic = "force-dynamic";

type VisionTask = "radiology" | "id_card" | "general";

const TASK_PROMPTS: Record<VisionTask, string> = {
  radiology: `You are a radiology assistant analysing a chest X-ray image for a clinic demo in India.
Return ONLY valid JSON with keys:
- finding (string, 2-4 sentences, assistive not diagnostic)
- confidence (number 0-1)
- regions (array of strings, suspected areas)
- recommendation (string, one sentence)
Note: clinician must review. Do not claim definitive diagnosis.`,

  id_card: `Extract fields from this Indian ID card / Aadhaar-style demo card image.
Return ONLY valid JSON with keys:
- fullName (string)
- dateOfBirth (string YYYY-MM-DD if possible)
- gender (Male or Female)
- address (string)
- aadhaarMasked (string format XXXX XXXX 1234 — mask all but last 4 digits)
- district (string)
- state (string)
- pinCode (string)
If a field is unreadable, use null.`,

  general: `Analyse this medical or clinical image for a healthcare demo.
Return ONLY valid JSON with keys:
- summary (string)
- observations (array of strings)
- confidence (number 0-1)
- suggested_action (string)`,
};

function demoVision(task: VisionTask) {
  if (task === "id_card") {
    return {
      fullName: "Priya Subramanian",
      dateOfBirth: "1994-08-12",
      gender: "Female",
      address: "Ward 42, T Nagar, Chennai, Tamil Nadu — 600017",
      aadhaarMasked: "XXXX XXXX 4821",
      district: "Chennai",
      state: "Tamil Nadu",
      pinCode: "600017",
      model: "demo-fallback",
      message: "Add GEMINI_API_KEY for live OCR vision",
    };
  }
  if (task === "radiology") {
    return {
      finding:
        "Patchy opacities in bilateral lower lung zones. Pattern may suggest inflammatory or infectious process. Correlate with vitals and symptoms.",
      confidence: 0.74,
      regions: ["Right lower zone", "Left lower zone"],
      recommendation: "Clinical correlation and follow-up imaging if symptoms persist.",
      model: "demo-fallback",
      message: "Add GEMINI_API_KEY for live Gemini Vision analysis",
    };
  }
  return {
    summary: "Image received. Enable GEMINI_API_KEY for AI vision analysis.",
    observations: ["Demo mode active"],
    confidence: 0.5,
    suggested_action: "Configure GEMINI_API_KEY in .env",
    model: "demo-fallback",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = (body.task ?? "general") as VisionTask;
    if (!TASK_PROMPTS[task]) {
      return NextResponse.json({ error: "Invalid task" }, { status: 400 });
    }

    const image = parseImageInput(body);
    if (!image) {
      return NextResponse.json({ error: "image_base64 or image_data_url required" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({
        task,
        status: "completed",
        ...demoVision(task),
      });
    }

    const model = getGeminiModel();
    if (!model) {
      return NextResponse.json({ error: "Gemini not configured" }, { status: 503 });
    }

    const start = Date.now();
    const result = await model.generateContent([
      TASK_PROMPTS[task],
      {
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      },
    ]);

    const text = result.response.text();
    const parsed = extractJsonFromText(text);
    const processing_ms = Date.now() - start;

    return NextResponse.json({
      task,
      status: "completed",
      model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
      processing_ms,
      ...(parsed ?? { raw_text: text }),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Vision analysis failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
