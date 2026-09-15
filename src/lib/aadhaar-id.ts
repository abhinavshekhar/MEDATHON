export type AadhaarIdRecord = {
  id: string;
  patientNo?: string;
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  address: string;
  district: string;
  state: string;
  pinCode: string;
  mobile?: string;
  aadhaarMasked: string;
  aadhaarLast4: string;
  source: "dataset" | "custom";
  createdAt: string;
};

export function maskAadhaar(last4: string) {
  return `XXXX XXXX ${last4}`;
}

export function generateAadhaarLast4(seed?: string) {
  if (seed) {
    let n = 0;
    for (let i = 0; i < seed.length; i++) n = (n + seed.charCodeAt(i) * (i + 1)) % 10000;
    return String(n).padStart(4, "0");
  }
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function dobFromAge(ageYears: number, ref = new Date("2026-09-15")) {
  const d = new Date(ref);
  d.setFullYear(d.getFullYear() - ageYears);
  return d.toISOString().slice(0, 10);
}

export function genderLabel(g: string): "Male" | "Female" {
  return g === "FEMALE" ? "Female" : "Male";
}
