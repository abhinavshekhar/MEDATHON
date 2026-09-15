import { NextRequest, NextResponse } from "next/server";
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { z } from "zod";
import type { AadhaarIdRecord } from "@/lib/aadhaar-id";
import { generateAadhaarLast4, maskAadhaar } from "@/lib/aadhaar-id";

const DATASET_DIR = join(process.cwd(), "aadhaar id dataset");
const CUSTOM_DIR = join(DATASET_DIR, "custom");
const RECORDS_FILE = join(DATASET_DIR, "records.json");

function loadAllRecords(): AadhaarIdRecord[] {
  const base: AadhaarIdRecord[] = existsSync(RECORDS_FILE)
    ? JSON.parse(readFileSync(RECORDS_FILE, "utf-8"))
    : [];

  const custom: AadhaarIdRecord[] = [];
  if (existsSync(CUSTOM_DIR)) {
    for (const file of readdirSync(CUSTOM_DIR).filter((f) => f.endsWith(".json"))) {
      custom.push(JSON.parse(readFileSync(join(CUSTOM_DIR, file), "utf-8")));
    }
  }

  return [...custom, ...base].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

const createSchema = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["Male", "Female"]),
  address: z.string().min(5),
  district: z.string().min(2).default("Chennai"),
  state: z.string().min(2).default("Tamil Nadu"),
  pinCode: z.string().min(6).max(6),
  mobile: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";
  let records = loadAllRecords();
  if (q) {
    records = records.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.aadhaarLast4.includes(q) ||
        r.district.toLowerCase().includes(q)
    );
  }
  return NextResponse.json({ records, total: records.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = createSchema.parse(await req.json());
    mkdirSync(CUSTOM_DIR, { recursive: true });

    const customCount = existsSync(CUSTOM_DIR)
      ? readdirSync(CUSTOM_DIR).filter((f) => f.endsWith(".json")).length
      : 0;
    const id = `AID-CUSTOM-${String(customCount + 1).padStart(4, "0")}`;
    const last4 = generateAadhaarLast4(body.fullName + body.dateOfBirth);

    const record: AadhaarIdRecord = {
      id,
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      address: body.address,
      district: body.district,
      state: body.state,
      pinCode: body.pinCode,
      mobile: body.mobile,
      aadhaarMasked: maskAadhaar(last4),
      aadhaarLast4: last4,
      source: "custom",
      createdAt: new Date().toISOString(),
    };

    writeFileSync(join(CUSTOM_DIR, `${id}.json`), JSON.stringify(record, null, 2));
    return NextResponse.json({ record }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create ID";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
