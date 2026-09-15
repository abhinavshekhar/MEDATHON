import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

const COUNT = 2000;
const WINDOW_START = new Date("2026-09-15T00:00:00+05:30");
const WINDOW_END = new Date("2026-09-16T00:00:00+05:30");
const OUTPUT_DIR = join(process.cwd(), "patient dataset");

const CLINIC = {
  name: "MEDATHON Urban Health Centre — Chennai",
  district: "Chennai",
  block: "Chennai Corporation",
  hfrId: "HFR-TN-CHN-001",
};

const FIRST_NAMES_M = [
  "Karthik", "Arun", "Vikram", "Suresh", "Ganesh", "Murugan", "Rajesh", "Prakash", "Dinesh", "Hari",
  "Senthil", "Balaji", "Mohan", "Ramesh", "Karthikeyan", "Aravind", "Saravanan", "Ashwin", "Naveen", "Vignesh",
];
const FIRST_NAMES_F = [
  "Priya", "Divya", "Lakshmi", "Meena", "Kavya", "Anitha", "Deepa", "Shalini", "Nithya", "Preethi",
  "Kamala", "Revathi", "Swetha", "Gayathri", "Pooja", "Janani", "Malathi", "Bhuvana", "Harini", "Yamini",
];
const LAST_NAMES = [
  "Iyer", "Iyengar", "Reddy", "Naidu", "Pillai", "Kumar", "Rajan", "Selvam", "Krishnan", "Subramanian",
  "Venkatesh", "Balakrishnan", "Raman", "Gopal", "Chidambaram", "Sundaram", "Narayanan", "Muthu", "Shanmugam", "Perumal",
];

/** ~70% Chennai, ~30% other Tamil Nadu districts */
const DISTRICT_WEIGHTS: { district: string; weight: number }[] = [
  { district: "Chennai", weight: 70 },
  { district: "Chengalpattu", weight: 8 },
  { district: "Tiruvallur", weight: 6 },
  { district: "Kanchipuram", weight: 5 },
  { district: "Coimbatore", weight: 4 },
  { district: "Madurai", weight: 3 },
  { district: "Tiruchirappalli", weight: 2 },
  { district: "Salem", weight: 2 },
];

const CHENNAI_LOCALITIES = [
  "T Nagar", "Anna Nagar", "Adyar", "Velachery", "Tambaram", "Mylapore", "Egmore", "Porur",
  "Chromepet", "Sholinganallur", "Royapuram", "Kilpauk", "Nungambakkam", "Guindy", "Perambur",
  "Ambattur", "Pallavaram", "Medavakkam", "Thoraipakkam", "Virugambakkam",
];

const TN_LOCALITIES = [
  "Sriperumbudur", "Poonamallee", "Kelambakkam", "OMR", "ECR", "Avadi", "Guduvanchery",
  "Singanallur", "Peelamedu", "Tiruppur Road", "Anna Salai", "GST Road",
];

const CHENNAI_ZONES = [
  "Zone 1 — Thiru Vi Ka Nagar", "Zone 2 — Anna Nagar", "Zone 3 — Madhavaram", "Zone 4 — Tondiarpet",
  "Zone 5 — Royapuram", "Zone 6 — Thiru Vi Ka Nagar", "Zone 7 — Ambattur", "Zone 8 — Anna Nagar",
  "Zone 9 — Teynampet", "Zone 10 — Kodambakkam", "Zone 11 — Valasaravakkam", "Zone 12 — Alandur",
  "Zone 13 — Adyar", "Zone 14 — Perungudi", "Zone 15 — Sholinganallur",
];

const DOCTORS = [
  "Dr. Karthik Iyer", "Dr. Priya Subramanian", "Dr. Murugan Rajan", "Dr. Lakshmi Reddy",
  "Dr. Arun Naidu", "Dr. Meena Pillai", "Dr. Senthil Kumar", "Dr. Divya Krishnan",
];
const OPD_TYPES = ["General OPD", "MCH", "Pediatric", "Emergency"];
const REASONS = [
  "Fever and body ache", "Monsoon viral fever", "Cough and cold", "Abdominal pain", "Skin rash",
  "Diabetes follow-up", "Hypertension review", "Prenatal visit (PMSMA)", "Child vaccination (RI)",
  "Dengue screening", "Typhoid symptoms", "Headache", "Back pain", "Eye irritation",
  "Road traffic injury", "Heat exhaustion", "Asthma review",
];
const REFERRED_BY = [
  "Self / Walk-in", "108 Ambulance", "Tamil Nadu Govt PHC", "Corporate clinic referral",
  "ASHA / UHWC worker", "ESI dispensary", "Private nursing home", "School health camp",
];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["MALE", "FEMALE"] as const;
const STATUSES = ["REGISTERED", "IN_QUEUE", "WITH_DOCTOR", "COMPLETED"] as const;

const CHENNAI_PIN_CODES = [
  "600001", "600004", "600006", "600010", "600020", "600028", "600033", "600040",
  "600042", "600078", "600083", "600086", "600091", "600096", "600100", "600113",
  "600119", "600126",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDistrict() {
  const total = DISTRICT_WEIGHTS.reduce((s, d) => s + d.weight, 0);
  let r = Math.random() * total;
  for (const d of DISTRICT_WEIGHTS) {
    r -= d.weight;
    if (r <= 0) return d.district;
  }
  return "Chennai";
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomTimestamp(start: Date, end: Date) {
  const t = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(t);
}

function pad(n: number, len = 4) {
  return String(n).padStart(len, "0");
}

function mobileFor(i: number) {
  const prefixes = ["98", "97", "96", "95", "94", "93", "91", "90", "88", "87"];
  return `${pick(prefixes)}${String(10000000 + (i % 90000000)).slice(0, 8)}`;
}

type DatasetPatient = {
  patientNo: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  ageYears: number;
  ageMonths: number;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  mobile: string;
  email: string | null;
  country: string;
  state: string;
  district: string;
  block: string;
  ward: string;
  village: string;
  pinCode: string;
  address: string;
  schemePMJAY: boolean;
  schemeBPL: boolean;
  schemeRBSK: boolean;
  schemePMSMA: boolean;
  registeredAt: string;
  visit: {
    visitId: string;
    opdType: string;
    doctorName: string;
    referredBy: string;
    reason: string;
    feeAmount: number;
    paymentCollected: boolean;
    status: string;
    visitDate: string;
  };
};

function generateRecord(index: number): DatasetPatient {
  const gender = pick([...GENDERS]);
  const firstName = gender === "FEMALE" ? pick(FIRST_NAMES_F) : pick(FIRST_NAMES_M);
  const lastName = pick(LAST_NAMES);
  const registeredAt = randomTimestamp(WINDOW_START, WINDOW_END);
  const district = pickDistrict();
  const isChennai = district === "Chennai";
  const locality = isChennai ? pick(CHENNAI_LOCALITIES) : pick(TN_LOCALITIES);
  const block = isChennai ? pick(CHENNAI_ZONES) : `${district} Taluk`;
  const ward = `Ward ${randInt(1, 200)}`;
  const pinCode = isChennai ? pick(CHENNAI_PIN_CODES) : String(600000 + randInt(200, 699));

  return {
    patientNo: `P-CHN-20260915-${pad(index + 1)}`,
    firstName,
    middleName: Math.random() > 0.75 ? pick(LAST_NAMES) : null,
    lastName,
    ageYears: randInt(1, 85),
    ageMonths: randInt(0, 11),
    gender,
    maritalStatus: pick(["SINGLE", "MARRIED", "DIVORCED", "WIDOW", "WIDOWER"]),
    bloodGroup: pick(BLOOD_GROUPS),
    mobile: mobileFor(index),
    email: Math.random() > 0.55 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@gmail.com` : null,
    country: "India",
    state: "Tamil Nadu",
    district,
    block,
    ward,
    village: locality,
    pinCode,
    address: `${ward}, ${locality}, ${block}, ${district}, Tamil Nadu — ${pinCode}`,
    schemePMJAY: Math.random() > 0.5,
    schemeBPL: Math.random() > 0.6,
    schemeRBSK: Math.random() > 0.75,
    schemePMSMA: gender === "FEMALE" && Math.random() > 0.7,
    registeredAt: registeredAt.toISOString(),
    visit: {
      visitId: `V-CHN-20260915-${pad(index + 1)}`,
      opdType: pick(OPD_TYPES),
      doctorName: pick(DOCTORS),
      referredBy: pick(REFERRED_BY),
      reason: pick(REASONS),
      feeAmount: pick([0, 20, 50, 100, 150]),
      paymentCollected: Math.random() > 0.2,
      status: pick([...STATUSES]),
      visitDate: registeredAt.toISOString(),
    },
  };
}

function toCsvRow(p: DatasetPatient) {
  return [
    p.patientNo,
    p.firstName,
    p.middleName ?? "",
    p.lastName,
    p.ageYears,
    p.gender,
    p.mobile,
    p.district,
    p.state,
    p.village,
    p.pinCode,
    p.visit.opdType,
    p.visit.doctorName,
    p.visit.status,
    p.registeredAt,
  ]
    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
    .join(",");
}

async function clearPatientData() {
  console.log("Clearing existing patient data…");
  await prisma.vitalLog.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.mLCDetails.deleteMany();
  await prisma.labTestResult.deleteMany();
  await prisma.labOrder.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.oPDVisit.deleteMany();
  await prisma.patient.deleteMany();
}

async function main() {
  console.log(`Generating ${COUNT} patients — Chennai & Tamil Nadu, India (${WINDOW_START.toISOString()} → ${WINDOW_END.toISOString()})…`);

  const patients: DatasetPatient[] = [];
  for (let i = 0; i < COUNT; i++) {
    patients.push(generateRecord(i));
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const allDistricts = DISTRICT_WEIGHTS.map((d) => d.district);

  const metadata = {
    title: "MEDATHON Patient Dataset — Chennai & Tamil Nadu",
    description: "2000 synthetic OPD registrations centred on Chennai, Tamil Nadu, India",
    region: { country: "India", state: "Tamil Nadu", primaryCity: "Chennai" },
    count: COUNT,
    windowStart: WINDOW_START.toISOString(),
    windowEnd: WINDOW_END.toISOString(),
    timezone: "Asia/Kolkata (IST)",
    clinic: CLINIC,
    generatedAt: new Date().toISOString(),
    files: {
      patients: "patients.json",
      csv: "patients.csv",
      summary: "summary.json",
    },
  };

  const summary = {
    totalPatients: COUNT,
    region: "Chennai & Tamil Nadu, India",
    byGender: {
      MALE: patients.filter((p) => p.gender === "MALE").length,
      FEMALE: patients.filter((p) => p.gender === "FEMALE").length,
    },
    byOpdType: OPD_TYPES.reduce(
      (acc, t) => ({ ...acc, [t]: patients.filter((p) => p.visit.opdType === t).length }),
      {} as Record<string, number>
    ),
    byStatus: STATUSES.reduce(
      (acc, s) => ({ ...acc, [s]: patients.filter((p) => p.visit.status === s).length }),
      {} as Record<string, number>
    ),
    schemePMJAY: patients.filter((p) => p.schemePMJAY).length,
    schemeBPL: patients.filter((p) => p.schemeBPL).length,
    schemePMSMA: patients.filter((p) => p.schemePMSMA).length,
    chennaiPatients: patients.filter((p) => p.district === "Chennai").length,
    districts: allDistricts.map((d) => ({
      district: d,
      state: "Tamil Nadu",
      count: patients.filter((p) => p.district === d).length,
    })),
    topLocalities: [...CHENNAI_LOCALITIES, ...TN_LOCALITIES]
      .map((loc) => ({ locality: loc, count: patients.filter((p) => p.village === loc).length }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };

  writeFileSync(join(OUTPUT_DIR, "metadata.json"), JSON.stringify(metadata, null, 2));
  writeFileSync(join(OUTPUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));
  writeFileSync(join(OUTPUT_DIR, "patients.json"), JSON.stringify(patients, null, 2));

  const csvHeader =
    "patientNo,firstName,middleName,lastName,ageYears,gender,mobile,district,state,locality,pinCode,opdType,doctorName,status,registeredAt\n";
  const csvBody = patients.map(toCsvRow).join("\n");
  writeFileSync(join(OUTPUT_DIR, "patients.csv"), csvHeader + csvBody);

  console.log(`Saved to: ${OUTPUT_DIR}`);
  console.log(`  Chennai patients: ${summary.chennaiPatients} / ${COUNT}`);
  console.log("  - patients.json, patients.csv, metadata.json, summary.json");

  const importDb = process.argv.includes("--import-db");
  const replaceDb = process.argv.includes("--replace-db");

  if (importDb) {
    if (replaceDb) await clearPatientData();

    console.log("\nImporting into database…");
    const clinic = await prisma.clinic.upsert({
      where: { id: 1 },
      update: { name: CLINIC.name, district: CLINIC.district, block: CLINIC.block, hfrId: CLINIC.hfrId },
      create: CLINIC,
    });

    const batchSize = 100;
    for (let i = 0; i < patients.length; i += batchSize) {
      const batch = patients.slice(i, i + batchSize);
      await prisma.$transaction(
        batch.map((p) =>
          prisma.patient.create({
            data: {
              patientNo: p.patientNo,
              firstName: p.firstName,
              middleName: p.middleName,
              lastName: p.lastName,
              ageYears: p.ageYears,
              ageMonths: p.ageMonths,
              gender: p.gender,
              maritalStatus: p.maritalStatus,
              bloodGroup: p.bloodGroup,
              mobile: p.mobile,
              email: p.email,
              country: p.country,
              state: p.state,
              district: p.district,
              block: p.block,
              ward: p.ward,
              village: p.village,
              pinCode: p.pinCode,
              address: p.address,
              schemePMJAY: p.schemePMJAY,
              schemeBPL: p.schemeBPL,
              schemeRBSK: p.schemeRBSK,
              schemePMSMA: p.schemePMSMA,
              abhaAddress: Math.random() > 0.35
                ? `${p.firstName.toLowerCase()}.${p.lastName.toLowerCase()}@abdm`
                : null,
              createdAt: new Date(p.registeredAt),
              updatedAt: new Date(p.registeredAt),
              visits: {
                create: {
                  visitId: p.visit.visitId,
                  clinicId: clinic.id,
                  opdType: p.visit.opdType,
                  doctorName: p.visit.doctorName,
                  referredBy: p.visit.referredBy,
                  reason: p.visit.reason,
                  feeAmount: p.visit.feeAmount,
                  paymentCollected: p.visit.paymentCollected,
                  status: p.visit.status,
                  visitDate: new Date(p.visit.visitDate),
                  createdAt: new Date(p.visit.visitDate),
                  updatedAt: new Date(p.visit.visitDate),
                },
              },
            },
          })
        )
      );
      process.stdout.write(`  Imported ${Math.min(i + batchSize, patients.length)} / ${patients.length}\r`);
    }
    console.log(`\nDatabase import complete (${COUNT} patients + visits).`);
  }

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
