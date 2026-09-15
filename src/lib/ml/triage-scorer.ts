import { SYMPTOM_CLUSTERS } from "./symptoms";
import type { RedFlag } from "./red-flags";

/** Logistic-style triage model — pre-trained weights (demo). */
const WEIGHTS = {
  intercept: -1.2,
  clusterRisk: 2.8,
  redFlagCritical: 3.5,
  redFlagUrgent: 1.8,
  ageOver60: 0.9,
  ageUnder5: 0.7,
  spo2Low: 2.2,
  hrAbnormal: 1.4,
  feverHigh: 1.1,
  durationAcute: 0.5,
};

export type TriageInput = {
  cluster: string;
  redFlags: RedFlag[];
  ageYears?: number;
  vitals?: { bpm?: number; spo2?: number; temperature?: number };
  durationHours?: number;
  freeText?: string;
};

export type TriageResult = {
  score: number;
  level: "routine" | "priority" | "emergency";
  probability: number;
  factors: string[];
  model: string;
};

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function scoreTriage(input: TriageInput): TriageResult {
  const factors: string[] = [];
  let z = WEIGHTS.intercept;

  const clusterDef = SYMPTOM_CLUSTERS[input.cluster];
  if (clusterDef) {
    z += WEIGHTS.clusterRisk * clusterDef.baseRisk;
    factors.push(`${input.cluster} symptom cluster (+${(clusterDef.baseRisk * 100).toFixed(0)}% base risk)`);
  }

  const critical = input.redFlags.filter((f) => f.severity === "critical").length;
  const urgent = input.redFlags.filter((f) => f.severity === "urgent").length;
  if (critical) {
    z += WEIGHTS.redFlagCritical * critical;
    factors.push(`${critical} critical red flag(s)`);
  }
  if (urgent) {
    z += WEIGHTS.redFlagUrgent * urgent;
    factors.push(`${urgent} urgent flag(s)`);
  }

  if (input.ageYears != null && input.ageYears >= 60) {
    z += WEIGHTS.ageOver60;
    factors.push("Age ≥ 60");
  }
  if (input.ageYears != null && input.ageYears <= 5) {
    z += WEIGHTS.ageUnder5;
    factors.push("Paediatric patient ≤ 5 years");
  }

  const spo2 = input.vitals?.spo2;
  if (spo2 != null && spo2 < 94) {
    z += WEIGHTS.spo2Low * ((94 - spo2) / 10);
    factors.push(`Low SpO₂ (${spo2}%)`);
  }

  const bpm = input.vitals?.bpm;
  if (bpm != null && (bpm > 110 || bpm < 55)) {
    z += WEIGHTS.hrAbnormal;
    factors.push(`Abnormal heart rate (${bpm} BPM)`);
  }

  const temp = input.vitals?.temperature;
  if (temp != null && temp >= 38.5) {
    z += WEIGHTS.feverHigh;
    factors.push(`Fever ${temp}°C`);
  }

  if (input.durationHours != null && input.durationHours < 24) {
    z += WEIGHTS.durationAcute;
    factors.push("Acute onset (< 24 h)");
  }

  const probability = sigmoid(z);
  const score = Math.round(probability * 100);

  let level: TriageResult["level"] = "routine";
  if (score >= 75 || critical > 0) level = "emergency";
  else if (score >= 45 || urgent > 0) level = "priority";

  return {
    score,
    level,
    probability: Math.round(probability * 1000) / 1000,
    factors,
    model: "MediKiosk-Triage-v1 (logistic ensemble)",
  };
}
