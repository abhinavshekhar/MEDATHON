import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreTriage, type RedFlag } from "@/lib/ml";

export const dynamic = "force-dynamic";

const redFlagSchema = z.object({
  id: z.string(),
  label: z.string(),
  severity: z.enum(["critical", "urgent"]),
  action: z.string(),
});

const schema = z.object({
  cluster: z.string(),
  redFlags: z.array(redFlagSchema).optional().default([]),
  ageYears: z.number().optional(),
  vitals: z
    .object({
      bpm: z.number().optional(),
      spo2: z.number().optional(),
      temperature: z.number().optional(),
    })
    .optional(),
  durationHours: z.number().optional(),
  freeText: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    const triage = scoreTriage({
      cluster: body.cluster,
      redFlags: body.redFlags as RedFlag[],
      ageYears: body.ageYears,
      vitals: body.vitals,
      durationHours: body.durationHours,
      freeText: body.freeText,
    });

    return NextResponse.json(triage);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Triage scoring failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
