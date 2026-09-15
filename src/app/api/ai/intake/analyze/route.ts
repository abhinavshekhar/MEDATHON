import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { geminiAnalyzeNarrative, isGeminiConfigured } from "@/lib/gemini";
import {
  classifyText,
  detectRedFlags,
  answersToNarrative,
  type InterviewAnswer,
} from "@/lib/ml";

export const dynamic = "force-dynamic";

const schema = z.object({
  text: z.string().optional(),
  complaint: z.string().optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional()
    .default([]),
  vitals: z
    .object({
      bpm: z.number().optional(),
      spo2: z.number().optional(),
      temp: z.number().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const answers = body.answers as InterviewAnswer[];

    const narrative =
      body.text?.trim() ||
      (body.complaint
        ? answersToNarrative(body.complaint, answers)
        : answers.map((a) => `${a.question} ${a.answer}`).join(" "));

    const redFlags = detectRedFlags(narrative, body.vitals);
    let classification = classifyText(narrative);
    let model = "MediKiosk-SymptomClassifier-v1";
    let entities: { symptoms: string[]; medications: string[]; durations: string[] } | undefined;

    if (isGeminiConfigured() && narrative.length > 10) {
      try {
        const gemini = await geminiAnalyzeNarrative(narrative);
        classification = {
          cluster: gemini.cluster,
          confidence: gemini.confidence,
          department: gemini.department,
        };
        entities = gemini.entities;
        model = `gemini-${process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash"}`;
      } catch (e) {
        console.error("Gemini analyze failed, using local ML:", e);
      }
    }

    return NextResponse.json({
      classification,
      redFlags,
      narrative,
      entities,
      model,
      geminiEnabled: isGeminiConfigured(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
