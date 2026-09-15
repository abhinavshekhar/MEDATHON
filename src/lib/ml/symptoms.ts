/** Symptom lexicon with ICD-style clusters for classification. */
export const SYMPTOM_CLUSTERS: Record<
  string,
  { keywords: string[]; department: string; baseRisk: number }
> = {
  cardiac: {
    keywords: [
      "chest pain",
      "chest tightness",
      "palpitation",
      "breathless",
      "dyspnoea",
      "dyspnea",
      "arm pain",
      "jaw pain",
    ],
    department: "Cardiology / Emergency",
    baseRisk: 0.72,
  },
  respiratory: {
    keywords: ["cough", "fever", "wheeze", "sputum", "cold", "throat", "breathing"],
    department: "Pulmonology / General OPD",
    baseRisk: 0.45,
  },
  neuro: {
    keywords: [
      "headache",
      "seizure",
      "weakness",
      "numbness",
      "speech",
      "vision",
      "stroke",
      "paralysis",
    ],
    department: "Neurology / Emergency",
    baseRisk: 0.68,
  },
  gi: {
    keywords: ["abdominal", "stomach", "vomit", "nausea", "diarrhea", "diarrhoea", "constipation"],
    department: "Gastroenterology",
    baseRisk: 0.38,
  },
  metabolic: {
    keywords: ["diabetes", "sugar", "thirst", "urination", "weight loss", "fatigue"],
    department: "General Medicine",
    baseRisk: 0.35,
  },
};

export const CHIEF_COMPLAINTS = [
  { id: "chest_pain", label: "Chest pain", cluster: "cardiac" },
  { id: "fever", label: "Fever", cluster: "respiratory" },
  { id: "cough", label: "Cough / cold", cluster: "respiratory" },
  { id: "headache", label: "Headache", cluster: "neuro" },
  { id: "abdominal", label: "Abdominal pain", cluster: "gi" },
  { id: "weakness", label: "Weakness / numbness", cluster: "neuro" },
  { id: "other", label: "Other complaint", cluster: "metabolic" },
] as const;

export function classifyText(text: string): { cluster: string; confidence: number; department: string } {
  const lower = text.toLowerCase();
  let best = { cluster: "metabolic", score: 0, department: "General OPD" };

  for (const [cluster, def] of Object.entries(SYMPTOM_CLUSTERS)) {
    const hits = def.keywords.filter((k) => lower.includes(k)).length;
    const score = hits / def.keywords.length;
    if (score > best.score) {
      best = { cluster, score, department: def.department };
    }
  }

  const confidence = Math.min(0.95, 0.35 + best.score * 0.6);
  return { cluster: best.cluster, confidence, department: best.department };
}
