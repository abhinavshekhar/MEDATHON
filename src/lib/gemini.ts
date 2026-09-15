import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-2.0-flash";

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== "MY_GEMINI_API_KEY");
}

function getModel() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2048,
    },
  });
}

export type GeminiClinicalSummary = {
  chiefComplaint: string;
  hpi: string;
  pastHistory: string;
  medications: string[];
  allergies: string[];
  reviewOfSystems: string;
  suggestedDepartment: string;
  physicianSummary: string;
  redFlagNotes: string[];
};

const SUMMARY_SCHEMA = `{
  "chiefComplaint": "string",
  "hpi": "string (bullet points ok)",
  "pastHistory": "string",
  "medications": ["string"],
  "allergies": ["string"],
  "reviewOfSystems": "string",
  "suggestedDepartment": "string",
  "physicianSummary": "string (concise physician-ready paragraph + structured sections)",
  "redFlagNotes": ["string"]
}`;

export async function geminiSummarizeIntake(input: {
  patientName: string;
  ageYears?: number;
  gender?: string;
  complaint: string;
  answers: { question: string; answer: string }[];
  freeText?: string;
  vitals?: { bpm?: number; spo2?: number; temperature?: number };
  localRedFlags?: string[];
}): Promise<GeminiClinicalSummary> {
  const model = getModel();

  const qaBlock = input.answers
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n\n");

  const prompt = `You are a clinical documentation assistant for Indian hospital OPD intake (MediKiosk, Ministry of Ayush).
Convert the patient kiosk interview into a structured, physician-ready clinical summary.
Use standard format: Chief Complaint, HPI (with SOCRATES where relevant), PMH, medications, allergies, ROS.
Be factual — do not invent findings not present in the input. Flag uncertainty explicitly.
Patient: ${input.patientName}${input.ageYears != null ? `, ${input.ageYears}y` : ""}${input.gender ? `, ${input.gender}` : ""}.
Chief complaint category: ${input.complaint}.
${input.vitals ? `Vitals: HR ${input.vitals.bpm ?? "—"} bpm, SpO2 ${input.vitals.spo2 ?? "—"}%, Temp ${input.vitals.temperature ?? "—"}°C.` : ""}
${input.localRedFlags?.length ? `Local ML red flags already detected: ${input.localRedFlags.join("; ")}` : ""}

Interview:
${qaBlock}
${input.freeText ? `\nAdditional narrative: ${input.freeText}` : ""}

Respond with ONLY valid JSON matching this schema (no markdown fences):
${SUMMARY_SCHEMA}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonStr = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(jsonStr) as GeminiClinicalSummary;
}

export async function geminiAnalyzeNarrative(historyText: string): Promise<{
  cluster: string;
  department: string;
  confidence: number;
  entities: { symptoms: string[]; medications: string[]; durations: string[] };
  narrative: string;
}> {
  const model = getModel();

  const prompt = `Analyze this patient-reported clinical narrative from an Indian OPD kiosk.
Extract symptoms, medications, and duration phrases. Suggest symptom cluster (cardiac|respiratory|neuro|gi|metabolic) and department routing.

Narrative:
${historyText}

Respond with ONLY valid JSON:
{
  "cluster": "cardiac|respiratory|neuro|gi|metabolic",
  "department": "string",
  "confidence": 0.0-1.0,
  "entities": { "symptoms": [], "medications": [], "durations": [] },
  "narrative": "one-line clinical synopsis"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonStr = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(jsonStr);
}

export async function geminiNextQuestion(input: {
  complaint: string;
  answers: { question: string; answer: string }[];
}): Promise<{ question: string; options: string[] } | null> {
  const model = getModel();

  const prompt = `You are conducting a structured clinical history (SOCRATES for pain) at an Indian hospital kiosk.
Chief complaint: ${input.complaint}
Prior Q&A:
${input.answers.map((a) => `- ${a.question} → ${a.answer}`).join("\n") || "(none yet)"}

If the history is complete (≥5 relevant answers), respond: {"done": true}
Otherwise ask ONE follow-up question with 3-4 tap options for low-literacy patients.
Respond with ONLY JSON: {"question": "...", "options": ["...", "..."]} or {"done": true}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonStr = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  const parsed = JSON.parse(jsonStr);
  if (parsed.done) return null;
  return { question: parsed.question, options: parsed.options ?? [] };
}
