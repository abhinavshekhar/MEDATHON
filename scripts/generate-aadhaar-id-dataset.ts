import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { AadhaarIdRecord } from "../src/lib/aadhaar-id";
import { dobFromAge, genderLabel, maskAadhaar, generateAadhaarLast4 } from "../src/lib/aadhaar-id";

const OUTPUT_DIR = join(process.cwd(), "aadhaar id dataset");
const CUSTOM_DIR = join(OUTPUT_DIR, "custom");
const COUNT = 2000;

type PatientRow = {
  patientNo: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string;
  ageYears: number;
  gender: string;
  mobile?: string;
  address: string;
  district: string;
  state: string;
  pinCode: string;
};

function fullName(p: PatientRow) {
  return [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ");
}

function main() {
  const patientsPath = join(process.cwd(), "patient dataset", "patients.json");
  const patients: PatientRow[] = JSON.parse(readFileSync(patientsPath, "utf-8"));
  const sample = patients.slice(0, COUNT);

  const records: AadhaarIdRecord[] = sample.map((p, i) => {
    const last4 = generateAadhaarLast4(p.patientNo);
    return {
      id: `AID-CHN-${String(i + 1).padStart(4, "0")}`,
      patientNo: p.patientNo,
      fullName: fullName(p),
      dateOfBirth: dobFromAge(p.ageYears),
      gender: genderLabel(p.gender),
      address: p.address,
      district: p.district,
      state: p.state,
      pinCode: p.pinCode,
      mobile: p.mobile,
      aadhaarMasked: maskAadhaar(last4),
      aadhaarLast4: last4,
      source: "dataset",
      createdAt: new Date().toISOString(),
    };
  });

  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(CUSTOM_DIR, { recursive: true });

  writeFileSync(join(OUTPUT_DIR, "records.json"), JSON.stringify(records, null, 2));
  writeFileSync(
    join(OUTPUT_DIR, "metadata.json"),
    JSON.stringify(
      {
        title: "MEDATHON Aadhaar ID PDF Dataset",
        description: "Sample demo ID card records for OCR training and PDF generation (Chennai, Tamil Nadu)",
        count: records.length,
        region: { country: "India", state: "Tamil Nadu", city: "Chennai" },
        disclaimer: "SAMPLE DEMO IDs ONLY — not real Aadhaar numbers",
        files: { records: "records.json", custom: "custom/" },
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log(`Created ${records.length} ID records in: ${OUTPUT_DIR}`);
}

main();
