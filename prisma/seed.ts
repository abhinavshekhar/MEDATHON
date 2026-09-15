import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const clinic = await prisma.clinic.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "MEDATHON Urban Health Centre — Chennai", district: "Chennai", block: "Chennai Corporation", hfrId: "HFR-TN-CHN-001" },
  });

  await prisma.kioskDevice.upsert({
    where: { deviceId: "KIOSK-01" },
    update: {},
    create: {
      deviceId: "KIOSK-01",
      name: "Reception Vitals Kiosk",
      clinicId: clinic.id,
      isOnline: true,
      lastSeen: new Date(),
    },
  });

  console.log("Seed complete:", { clinic: clinic.name });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
