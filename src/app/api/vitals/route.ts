import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  patientId: z.string(),
  visitId: z.string().optional(),
  kioskId: z.string().optional(),
  bpm: z.number(),
  spo2: z.number(),
  temperature: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());

    let kiosk = data.kioskId
      ? await prisma.kioskDevice.findFirst({ where: { deviceId: data.kioskId } })
      : await prisma.kioskDevice.findFirst();

    const vital = await prisma.vitalLog.create({
      data: {
        patientId: data.patientId,
        visitId: data.visitId ?? null,
        kioskId: kiosk?.id ?? null,
        bpm: data.bpm,
        spo2: data.spo2,
        temperature: data.temperature,
      },
      include: { patient: true, kiosk: true },
    });

    const aiUrl = process.env.NEXT_PUBLIC_AI_API_URL ?? "http://localhost:8000";
    fetch(`${aiUrl}/api/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: data.patientId,
        visit_id: data.visitId,
        kiosk_id: kiosk?.deviceId ?? "KIOSK-01",
        bpm: data.bpm,
        spo2: data.spo2,
        temperature: data.temperature,
      }),
    }).catch(() => {});

    return NextResponse.json({ ok: true, vital }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save vitals";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get("patientId");
  if (!patientId) return NextResponse.json({ error: "patientId required" }, { status: 400 });

  const vitals = await prisma.vitalLog.findMany({
    where: { patientId },
    orderBy: { recordedAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ patientId, readings: vitals });
}
