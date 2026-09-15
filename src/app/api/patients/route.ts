import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { patientRegistrationSchema } from "@/lib/validations/patient";
import { generatePatientNo, generateVisitId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  const patients = await prisma.patient.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { patientNo: { contains: q } },
            { mobile: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      visits: { orderBy: { visitDate: "desc" }, take: 1 },
    },
  });

  return NextResponse.json(patients);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = patientRegistrationSchema.parse(body);

    let clinic = await prisma.clinic.findFirst();
    if (!clinic) {
      clinic = await prisma.clinic.create({
        data: { name: "MEDATHON Urban Health Centre — Chennai", district: "Chennai", block: "Chennai Corporation" },
      });
    }

    const patient = await prisma.patient.create({
      data: {
        patientNo: generatePatientNo(),
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName || null,
        ageYears: data.ageYears ?? null,
        ageMonths: data.ageMonths ?? null,
        ageDays: data.ageDays ?? null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        maritalStatus: data.maritalStatus ?? null,
        fatherSpouseName: data.fatherSpouseName || null,
        ashaWorker: data.ashaWorker || null,
        bloodGroup: data.bloodGroup || null,
        category: data.category || null,
        email: data.email || null,
        mobile: data.mobile || null,
        aadhaarNo: data.aadhaarNo || null,
        epicNo: data.epicNo || null,
        abhaAddress: data.abhaAddress || null,
        country: data.country || "India",
        state: data.state || null,
        district: data.district || null,
        block: data.block || null,
        ward: data.ward || null,
        village: data.village || null,
        pinCode: data.pinCode || null,
        address: data.address || null,
        schemePMJAY: data.schemePMJAY,
        schemeBPL: data.schemeBPL,
      },
    });

    const visit = await prisma.oPDVisit.create({
      data: {
        visitId: generateVisitId(),
        patientId: patient.id,
        clinicId: clinic.id,
        opdType: data.opdType,
        doctorName: data.doctorName,
        referredBy: data.referredBy,
        reason: data.reason,
        feeAmount: data.feeAmount,
        paymentCollected: data.paymentCollected,
        status: "REGISTERED",
      },
    });

    return NextResponse.json({ patient, visit }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
