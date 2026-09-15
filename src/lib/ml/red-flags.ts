export type RedFlag = {
  id: string;
  label: string;
  severity: "critical" | "urgent";
  action: string;
};

const CRITICAL_PATTERNS: { pattern: RegExp; id: string; label: string; action: string }[] = [
  {
    pattern: /chest pain.{0,40}(breath|sweat|arm|jaw|radiat)/i,
    id: "acs",
    label: "Possible acute coronary syndrome",
    action: "Immediate triage — ECG and emergency physician",
  },
  {
    pattern: /(sudden|worst).{0,20}headache|thunderclap/i,
    id: "sah",
    label: "Thunderclap headache — rule out subarachnoid bleed",
    action: "Emergency neurology review",
  },
  {
    pattern: /(face droop|slurred speech|one sided weakness|facial weakness)/i,
    id: "stroke",
    label: "Stroke symptoms (FAST positive)",
    action: "Stroke protocol — immediate emergency queue",
  },
  {
    pattern: /(can't breathe|cannot breathe|choking|severe breathless)/i,
    id: "resp_distress",
    label: "Severe respiratory distress",
    action: "Oxygen and emergency assessment",
  },
  {
    pattern: /(suicidal|self harm|overdose)/i,
    id: "psych_emergency",
    label: "Psychiatric emergency indicators",
    action: "Mental health crisis protocol",
  },
];

export function detectRedFlags(text: string, vitals?: { bpm?: number; spo2?: number; temp?: number }): RedFlag[] {
  const flags: RedFlag[] = [];

  for (const rule of CRITICAL_PATTERNS) {
    if (rule.pattern.test(text)) {
      flags.push({
        id: rule.id,
        label: rule.label,
        severity: "critical",
        action: rule.action,
      });
    }
  }

  if (vitals?.spo2 != null && vitals.spo2 < 90) {
    flags.push({
      id: "hypoxia",
      label: `SpO₂ ${vitals.spo2}% — significant hypoxia`,
      severity: "critical",
      action: "Supplemental oxygen and urgent review",
    });
  }
  if (vitals?.bpm != null && (vitals.bpm > 130 || vitals.bpm < 45)) {
    flags.push({
      id: "arrhythmia_risk",
      label: `Heart rate ${vitals.bpm} BPM — abnormal rhythm risk`,
      severity: "urgent",
      action: "Cardiac monitoring advised",
    });
  }
  if (vitals?.temp != null && vitals.temp >= 39.5) {
    flags.push({
      id: "hyperpyrexia",
      label: `Temperature ${vitals.temp}°C — high fever`,
      severity: "urgent",
      action: "Sepsis screening and antipyretics",
    });
  }

  return flags;
}
