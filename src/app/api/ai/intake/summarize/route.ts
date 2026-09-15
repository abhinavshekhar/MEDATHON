import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { geminiSummarizeIntake, isGeminiConfigured } from "@/lib/gemini";
import {
  buildStructuredHistory,
  physicianSummary,
  scoreTriage,
  detectRedFlags,
  classifyText,
  answersToNarrative,
  type InterviewAnswer,
  type RedFlag,
  type TriageResult,
} from "@/lib/ml";

export const dynamic = "force-dynamic";

const answerSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  answer: z.string(),
});

const triageSchema = z.object({
  score: z.number(),
  level: z.enum(["routine", "priority", "emergency"]),
  probability: z.number(),
  factors: z.array(z.string()),
  model: z.string(),
});

const schema = z.object({
  complaint: z.string(),
  answers: z.array(answerSchema).optional().default([]),
  freeText: z.string().optional(),
  patientName: z.string().optional().default("Patient"),
  gender: z.string().optional(),
  visitId: z.string().optional(),
  patientId: z.string().optional(),
  ageYears: z.number().optional(),
  vitals: z
    .object({
      bpm: z.number().optional(),
      spo2: z.number().optional(),
      temperature: z.number().optional(),
    })
    .optional(),
  triage: triageSchema.optional(),
  redFlags: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        severity: z.enum(["critical", "urgent"]),
        action: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const answers = body.answers as InterviewAnswer[];

    const narrative = answersToNarrative(body.complaint, answers);
    const fullText = [narrative, body.freeText ?? ""].filter(Boolean).join(" ");

    const redFlags: RedFlag[] =
      body.redFlags ??
      detectRedFlags(fullText, {
        bpm: body.vitals?.bpm,
        spo2: body.vitals?.spo2,
        temp: body.vitals?.temperature,
      });

    let structuredHistory = buildStructuredHistory(body.complaint, answers, body.freeText);
    let summary: string;
    let aiProvider = "MediKiosk-ML-v1";

    if (isGeminiConfigured()) {
      try {
        const gemini = await geminiSummarizeIntake({
          patientName: body.patientName,
          ageYears: body.ageYears,
          gender: body.gender,
          complaint: body.complaint,
          answers: answers.map((a) => ({ question: a.question, answer: a.answer })),
          freeText: body.freeText,
          vitals: body.vitals,
          localRedFlags: redFlags.map((f) => f.label),
        });

        structuredHistory = {
          chiefComplaint: gemini.chiefComplaint,
          hpi: gemini.hpi,
          pastHistory: gemini.pastHistory,
          medications: gemini.medications,
          allergies: gemini.allergies,
          reviewOfSystems: gemini.reviewOfSystems,
          suggestedDepartment: gemini.suggestedDepartment,
          classification: classifyText(fullText),
        };
        summary = gemini.physicianSummary;
        aiProvider = `gemini-${process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash"}`;
      } catch (geminiErr) {
        console.error("Gemini summarize failed, using ML fallback:", geminiErr);
        const triageFallback = scoreTriage({
          cluster: structuredHistory.classification.cluster,
          redFlags,
          ageYears: body.ageYears,
          vitals: body.vitals,
          freeText: fullText,
        });
        summary = physicianSummary(structuredHistory, triageFallback, redFlags, body.patientName);
      }
    } else {
      const triageFallback = scoreTriage({
        cluster: structuredHistory.classification.cluster,
        redFlags,
        ageYears: body.ageYears,
        vitals: body.vitals,
        freeText: fullText,
      });
      summary = physicianSummary(structuredHistory, triageFallback, redFlags, body.patientName);
    }

    const triage: TriageResult =
      body.triage ??
      scoreTriage({
        cluster: structuredHistory.classification.cluster,
        redFlags,
        ageYears: body.ageYears,
        vitals: body.vitals,
        freeText: fullText,
      });

    let savedToConsultation = false;
    if (body.visitId) {
      await prisma.consultation.upsert({
        where: { visitId: body.visitId },
        create: {
          visitId: body.visitId,
          aiSummary: summary,
        },
        update: {
          aiSummary: summary,
        },
      });
      savedToConsultation = true;
    }

    return NextResponse.json({
      structuredHistory,
      physicianSummary: summary,
      triage,
      redFlags,
      classification: classifyText(fullText),
      savedToConsultation,
      model: aiProvider,
      geminiEnabled: isGeminiConfigured(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Summarization failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
