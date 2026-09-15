import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      visits: { orderBy: { visitDate: "desc" } },
      vitalLogs: { orderBy: { recordedAt: "desc" }, take: 20 },
      prescriptions: { orderBy: { createdAt: "desc" }, take: 10 },
      labOrders: { orderBy: { orderedAt: "desc" }, take: 10 },
    },
  });

  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(patient);
}
