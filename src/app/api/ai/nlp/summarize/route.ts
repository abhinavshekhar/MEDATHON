import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { geminiSummarizeIntake, isGeminiConfigured } from "@/lib/gemini";
import {
  buildStructuredHistory,
  physicianSummary,
  classifyText,
  detectRedFlags,
  scoreTriage,
} from "@/lib/ml";

export const dynamic = "force-dynamic";

const schema = z.object({
  visit_id: z.string().optional(),
  patient_id: z.string().optional(),
  history_text: z.string(),
  patient_name: z.string().optional().default("Patient"),
  age_years: z.number().optional(),
  gender: z.string().optional(),
  vitals: z
    .object({
      bpm: z.number().optional(),
      spo2: z.number().optional(),
      temperature: z.number().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const historyText = body.history_text.trim();

    const classification = classifyText(historyText);
    const redFlags = detectRedFlags(historyText, {
      bpm: body.vitals?.bpm,
      spo2: body.vitals?.spo2,
      temp: body.vitals?.temperature,
    });

    let structuredHistory = buildStructuredHistory("Reported via NLP endpoint", [], historyText);
    structuredHistory.classification = classification;
    structuredHistory.suggestedDepartment = classification.department;

    const triage = scoreTriage({
      cluster: classification.cluster,
      redFlags,
      ageYears: body.age_years,
      vitals: body.vitals,
      freeText: historyText,
    });

    let summary: string;
    let model = "MediKiosk-ML-v1";

    if (isGeminiConfigured()) {
      try {
        const gemini = await geminiSummarizeIntake({
          patientName: body.patient_name,
          ageYears: body.age_years,
          gender: body.gender,
          complaint: "Free-text history",
          answers: [],
          freeText: historyText,
          vitals: body.vitals,
          localRedFlags: redFlags.map((f) => f.label),
        });
        structuredHistory = {
          ...structuredHistory,
          chiefComplaint: gemini.chiefComplaint,
          hpi: gemini.hpi,
          pastHistory: gemini.pastHistory,
          medications: gemini.medications,
          allergies: gemini.allergies,
          reviewOfSystems: gemini.reviewOfSystems,
          suggestedDepartment: gemini.suggestedDepartment,
        };
        summary = gemini.physicianSummary;
        model = `gemini-${process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash"}`;
      } catch {
        summary = physicianSummary(structuredHistory, triage, redFlags, body.patient_name);
      }
    } else {
      summary = physicianSummary(structuredHistory, triage, redFlags, body.patient_name);
    }

    let savedToConsultation = false;
    if (body.visit_id) {
      await prisma.consultation.upsert({
        where: { visitId: body.visit_id },
        create: { visitId: body.visit_id, aiSummary: summary },
        update: { aiSummary: summary },
      });
      savedToConsultation = true;
    }

    return NextResponse.json({
      visit_id: body.visit_id,
      patient_id: body.patient_id,
      status: "completed",
      summary,
      structured_history: structuredHistory,
      triage,
      red_flags: redFlags,
      classification,
      saved_to_consultation: savedToConsultation,
      model,
      gemini_enabled: isGeminiConfigured(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "NLP summarization failed";
    return NextResponse.json({ error: message, status: "failed" }, { status: 400 });
  }
}
