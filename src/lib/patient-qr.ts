import type { AadhaarIdRecord } from "./aadhaar-id";

export type PatientQrPayload = {
  type: "medathon-patient";
  patientNo: string;
  patientId?: string;
  name: string;
  abha?: string | null;
};

export function buildPatientQrPayload(data: {
  patientNo: string;
  patientId?: string;
  name: string;
  abhaAddress?: string | null;
}): PatientQrPayload {
  return {
    type: "medathon-patient",
    patientNo: data.patientNo,
    patientId: data.patientId,
    name: data.name,
    abha: data.abhaAddress ?? undefined,
  };
}

export function qrPayloadFromRecord(record: AadhaarIdRecord) {
  return buildPatientQrPayload({
    patientNo: record.patientNo ?? record.id,
    name: record.fullName,
    abhaAddress: `${record.fullName.toLowerCase().replace(/\s+/g, ".")}@abdm`,
  });
}

export function parsePatientQr(raw: string): PatientQrPayload | null {
  try {
    const data = JSON.parse(raw) as PatientQrPayload;
    if (data?.type === "medathon-patient" && data.patientNo) return data;
  } catch {
    /* plain patient number */
  }
  const trimmed = raw.trim();
  if (/^P-CHN-|^P-|^AID-/.test(trimmed)) {
    return { type: "medathon-patient", patientNo: trimmed, name: "" };
  }
  return null;
}
