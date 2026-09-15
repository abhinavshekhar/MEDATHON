import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGeminiModel, isGeminiConfigured } from "@/lib/gemini";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are MEDATHON Clinical Assistant — a helpful AI for doctors and clinic staff at an urban health centre in Chennai, Tamil Nadu, India.

Rules:
- Give clear, concise answers in plain English (Tamil phrases OK when helpful).
- You assist clinicians; you do NOT replace a doctor. Always say "correlate with clinical examination" for medical advice.
- Use patient context when provided (vitals, demographics).
- For emergencies (chest pain, severe breathlessness, stroke signs), advise immediate A&E referral.
- Keep answers under 200 words unless the user asks for detail.`;

async function buildPatientContext(patientId?: string, patientNo?: string) {
  if (!patientId && !patientNo) return "";

  const patient = patientId
    ? await prisma.patient.findUnique({ where: { id: patientId } })
    : await prisma.patient.findFirst({
        where: {
          OR: [{ patientNo: patientNo! }, { id: patientNo! }],
        },
      });

  if (!patient) return "";

  const vitals = await prisma.vitalLog.findMany({
    where: { patientId: patient.id },
    orderBy: { recordedAt: "desc" },
    take: 3,
  });

  const name = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ");
  const latest = vitals[0];
  const vitalStr = latest
    ? `Latest vitals: BPM ${latest.bpm}, SpO2 ${latest.spo2}%, Temp ${latest.temperature}°C (${latest.recordedAt?.toISOString() ?? "recent"}).`
    : "No vitals recorded yet.";

  return [
    `Patient: ${name} (${patient.patientNo ?? patient.id})`,
    `Age: ${patient.ageYears ?? "?"}y, Gender: ${patient.gender}`,
    patient.abhaAddress ? `ABHA: ${patient.abhaAddress}` : null,
    patient.mobile ? `Mobile: ${patient.mobile}` : null,
    vitalStr,
  ]
    .filter(Boolean)
    .join("\n");
}

function demoReply(message: string, context: string): string {
  const q = message.toLowerCase();
  if (q.includes("vitals") || q.includes("bpm") || q.includes("spo2")) {
    return context
      ? `${context}\n\nBased on available vitals, values appear within typical outpatient range. Correlate with symptoms and repeat measurement if the patient feels unwell.`
      : "Load a patient first (enter patient ID) so I can reference their vitals from the kiosk Digital Twin.";
  }
  if (q.includes("fever") || q.includes("dengue")) {
    return "For fever in Chennai OPD: check duration, rash, platelet trends if lab done, and hydration. Consider dengue screening during monsoon. Refer to A&E if bleeding, severe abdominal pain, or SpO2 below 92%.";
  }
  if (q.includes("abha") || q.includes("aadhaar")) {
    return "MEDATHON supports ABDM-style ABHA QR registration. Mask Aadhaar in UI (XXXX XXXX 1234). Use the ID scanner module for demo OCR — add GEMINI_API_KEY for live AI vision.";
  }
  return "I'm running in demo mode. Add GEMINI_API_KEY to .env for instant AI answers. You can ask about vitals, OPD workflow, lab interpretation, or patient triage.";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message ?? "").trim();
    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const history: ChatMessage[] = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const patientContext = await buildPatientContext(body.patient_id, body.patient_no);

    if (!isGeminiConfigured()) {
      const reply = demoReply(message, patientContext);
      return NextResponse.json({
        reply,
        model: "demo-fallback",
        patient_context_used: Boolean(patientContext),
      });
    }

    const model = getGeminiModel();
    if (!model) {
      return NextResponse.json({ error: "Gemini not configured" }, { status: 503 });
    }

    const transcript = history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = [
      SYSTEM_PROMPT,
      patientContext ? `\n--- Patient context ---\n${patientContext}` : "",
      transcript ? `\n--- Conversation ---\n${transcript}` : "",
      `\nUser: ${message}`,
      "\nAssistant:",
    ].join("");

    const start = Date.now();
    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();
    const processing_ms = Date.now() - start;

    return NextResponse.json({
      reply,
      model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
      processing_ms,
      patient_context_used: Boolean(patientContext),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
