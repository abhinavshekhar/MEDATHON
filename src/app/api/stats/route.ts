import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalPatients, todayOpd, labPending, vitalsToday] = await Promise.all([
    prisma.patient.count(),
    prisma.oPDVisit.count({ where: { visitDate: { gte: today } } }),
    prisma.labOrder.count({ where: { status: { in: ["ORDERED", "COLLECTED", "PROCESSING"] } } }),
    prisma.vitalLog.count({ where: { recordedAt: { gte: today } } }),
  ]);

  return NextResponse.json({
    totalPatients,
    todayOpd,
    labPending,
    vitalsToday,
    pharmacyPending: await prisma.prescription.count({ where: { status: "PENDING" } }),
  });
}
