import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LAB_TESTS = ["CBC", "Blood Sugar Fasting", "LFT", "KFT", "Dengue NS1", "Malaria PF/PV", "HbA1c"];
const MEDICINES = ["Paracetamol 500mg", "Amoxicillin 250mg", "Azithromycin 500mg", "Cetirizine 10mg", "Metformin 500mg"];
const STATUSES = ["ORDERED", "COLLECTED", "PROCESSING", "VERIFIED", "DISPATCHED"] as const;

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const patients = await prisma.patient.findMany({ take: 1200, include: { visits: { take: 1 } } });
  if (!patients.length) {
    console.log("No patients found. Run generate-patient-dataset.ts first.");
    return;
  }

  console.log("Seeding ABHA addresses…");
  const unlinked = await prisma.patient.findMany({ where: { abhaAddress: null }, take: 800 });
  for (const p of unlinked) {
    await prisma.patient.update({
      where: { id: p.id },
      data: { abhaAddress: `${p.firstName.toLowerCase()}.${p.lastName?.toLowerCase() ?? "user"}@abdm` },
    });
  }

  const existingLabs = await prisma.labOrder.count();
  if (existingLabs < 100) {
    console.log("Seeding lab orders…");
    for (let i = 0; i < 600; i++) {
      const patient = pick(patients);
      const status = pick([...STATUSES]);
      await prisma.labOrder.create({
        data: {
          patientId: patient.id,
          visitId: patient.visits[0]?.id ?? null,
          priority: Math.random() > 0.85 ? "URGENT" : "ROUTINE",
          status,
          orderedAt: patient.createdAt,
          verifiedAt: status === "VERIFIED" || status === "DISPATCHED" ? patient.createdAt : null,
          dispatchedAt: status === "DISPATCHED" ? patient.createdAt : null,
          tests: {
            create: Array.from({ length: 1 + (i % 3) }, () => ({
              testName: pick(LAB_TESTS),
              testCode: `T${1000 + (i % 900)}`,
              result: status === "VERIFIED" || status === "DISPATCHED" ? "Within range" : null,
              normalRange: "See report",
              unit: "—",
              isAbnormal: Math.random() > 0.9,
            })),
          },
        },
      });
    }
  }

  const existingRx = await prisma.prescription.count();
  if (existingRx < 100) {
    console.log("Seeding prescriptions…");
    for (let i = 0; i < 400; i++) {
      const patient = pick(patients);
      await prisma.prescription.create({
        data: {
          patientId: patient.id,
          visitId: patient.visits[0]?.id ?? null,
          doctorName: pick(["Dr. Karthik Iyer", "Dr. Priya Subramanian", "Dr. Murugan Rajan"]),
          status: "PENDING",
          createdAt: patient.createdAt,
          items: {
            create: Array.from({ length: 1 + (i % 2) }, (_, j) => ({
              medicineName: pick(MEDICINES),
              dosage: "1 tab",
              frequency: "BD",
              duration: "5 days",
              quantityPrescribed: 10 + j,
            })),
          },
        },
      });
    }
  }

  const existingVitals = await prisma.vitalLog.count();
  if (existingVitals < 100) {
    console.log("Seeding vital logs…");
    const kiosk = await prisma.kioskDevice.findFirst();
    for (let i = 0; i < 800; i++) {
      const patient = pick(patients);
      await prisma.vitalLog.create({
        data: {
          patientId: patient.id,
          visitId: patient.visits[0]?.id ?? null,
          kioskId: kiosk?.id ?? null,
          bpm: 62 + (i % 40),
          spo2: 94 + (i % 6),
          temperature: 36.2 + (i % 10) / 10,
          recordedAt: patient.createdAt,
        },
      });
    }
  }

  console.log("Operational data seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
