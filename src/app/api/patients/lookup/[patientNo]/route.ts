import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatPatientName } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { patientNo: string } }) {
  const patientNo = decodeURIComponent(params.patientNo);

  const patient = await prisma.patient.findUnique({
    where: { patientNo },
    include: {
      visits: { orderBy: { visitDate: "desc" }, take: 10 },
      vitalLogs: { orderBy: { recordedAt: "desc" }, take: 10 },
      prescriptions: { include: { items: true }, orderBy: { createdAt: "desc" }, take: 5 },
      labOrders: { include: { tests: true }, orderBy: { orderedAt: "desc" }, take: 5 },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: patient.id,
    patientNo: patient.patientNo,
    name: formatPatientName(patient),
    firstName: patient.firstName,
    lastName: patient.lastName,
    ageYears: patient.ageYears,
    gender: patient.gender,
    mobile: patient.mobile,
    district: patient.district,
    state: patient.state,
    address: patient.address,
    abhaAddress: patient.abhaAddress,
    visits: patient.visits,
    vitalLogs: patient.vitalLogs,
    prescriptions: patient.prescriptions,
    labOrders: patient.labOrders,
  });
}
