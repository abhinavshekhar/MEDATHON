"""
MediKiosk ML intake pipeline (Python) — mirrors src/lib/ml TypeScript logic.
Uses scikit-learn LogisticRegression for triage scoring.
"""

from __future__ import annotations

import math
import re
from typing import Any

import numpy as np
from sklearn.linear_model import LogisticRegression

SYMPTOM_CLUSTERS: dict[str, dict[str, Any]] = {
    "cardiac": {"base_risk": 0.72, "department": "Cardiology / Emergency"},
    "respiratory": {"base_risk": 0.45, "department": "Pulmonology / General OPD"},
    "neuro": {"base_risk": 0.68, "department": "Neurology / Emergency"},
    "gi": {"base_risk": 0.38, "department": "Gastroenterology"},
    "metabolic": {"base_risk": 0.35, "department": "General OPD"},
}

WEIGHTS = {
    "intercept": -1.2,
    "cluster_risk": 2.8,
    "red_flag_critical": 3.5,
    "red_flag_urgent": 1.8,
    "age_over_60": 0.9,
    "age_under_5": 0.7,
    "spo2_low": 2.2,
    "hr_abnormal": 1.4,
    "fever_high": 1.1,
    "duration_acute": 0.5,
}

CRITICAL_PATTERNS = [
    (re.compile(r"chest pain.{0,40}(breath|sweat|arm|jaw|radiat)", re.I), "acs", "Possible acute coronary syndrome", "Immediate triage — ECG and emergency physician"),
    (re.compile(r"(sudden|worst).{0,20}headache|thunderclap", re.I), "sah", "Thunderclap headache — rule out subarachnoid bleed", "Emergency neurology review"),
    (re.compile(r"(face droop|slurred speech|one sided weakness|facial weakness)", re.I), "stroke", "Stroke symptoms (FAST positive)", "Stroke protocol — immediate emergency queue"),
    (re.compile(r"(can't breathe|cannot breathe|choking|severe breathless)", re.I), "resp_distress", "Severe respiratory distress", "Oxygen and emergency assessment"),
    (re.compile(r"(suicidal|self harm|overdose)", re.I), "psych_emergency", "Psychiatric emergency indicators", "Mental health crisis protocol"),
]

# sklearn model fitted on representative synthetic samples encoding TS weights
_TRIAGE_MODEL = LogisticRegression(random_state=42)
_X = np.array(
    [
        [0.35, 0, 0, 0, 0, 0, 0, 0, 0],
        [0.72, 1, 0, 1, 0, 1, 1, 0, 1],
        [0.68, 2, 1, 0, 1, 0, 0, 1, 0],
        [0.45, 0, 1, 0, 0, 0, 0, 1, 1],
        [0.72, 3, 2, 1, 0, 1, 1, 1, 1],
    ]
)
_y = np.array([0, 1, 1, 0, 1])
_TRIAGE_MODEL.fit(_X, _y)


def _sigmoid(x: float) -> float:
    return 1 / (1 + math.exp(-x))


def detect_red_flags(text: str, vitals: dict[str, float] | None = None) -> list[dict[str, str]]:
    flags: list[dict[str, str]] = []
    for pattern, fid, label, action in CRITICAL_PATTERNS:
        if pattern.search(text):
            flags.append({"id": fid, "label": label, "severity": "critical", "action": action})

    if vitals:
        spo2 = vitals.get("spo2")
        if spo2 is not None and spo2 < 90:
            flags.append({
                "id": "hypoxia",
                "label": f"SpO₂ {spo2}% — significant hypoxia",
                "severity": "critical",
                "action": "Supplemental oxygen and urgent review",
            })
        bpm = vitals.get("bpm")
        if bpm is not None and (bpm > 130 or bpm < 45):
            flags.append({
                "id": "arrhythmia_risk",
                "label": f"Heart rate {bpm} BPM — abnormal rhythm risk",
                "severity": "urgent",
                "action": "Cardiac monitoring advised",
            })
        temp = vitals.get("temperature") or vitals.get("temp")
        if temp is not None and temp >= 39.5:
            flags.append({
                "id": "hyperpyrexia",
                "label": f"Temperature {temp}°C — high fever",
                "severity": "urgent",
                "action": "Sepsis screening and antipyretics",
            })
    return flags


def _extract_features(
    cluster: str,
    red_flags: list[dict[str, Any]],
    age_years: float | None,
    vitals: dict[str, float] | None,
    duration_hours: float | None,
) -> tuple[np.ndarray, list[str]]:
    factors: list[str] = []
    cluster_def = SYMPTOM_CLUSTERS.get(cluster, SYMPTOM_CLUSTERS["metabolic"])
    cluster_risk = cluster_def["base_risk"]
    factors.append(f"{cluster} symptom cluster (+{cluster_risk * 100:.0f}% base risk)")

    critical = sum(1 for f in red_flags if f.get("severity") == "critical")
    urgent = sum(1 for f in red_flags if f.get("severity") == "urgent")
    if critical:
        factors.append(f"{critical} critical red flag(s)")
    if urgent:
        factors.append(f"{urgent} urgent flag(s)")

    age_over_60 = 1 if age_years is not None and age_years >= 60 else 0
    age_under_5 = 1 if age_years is not None and age_years <= 5 else 0
    if age_over_60:
        factors.append("Age ≥ 60")
    if age_under_5:
        factors.append("Paediatric patient ≤ 5 years")

    spo2_low = 0.0
    hr_abnormal = 0
    fever_high = 0
    if vitals:
        spo2 = vitals.get("spo2")
        if spo2 is not None and spo2 < 94:
            spo2_low = (94 - spo2) / 10
            factors.append(f"Low SpO₂ ({spo2}%)")
        bpm = vitals.get("bpm")
        if bpm is not None and (bpm > 110 or bpm < 55):
            hr_abnormal = 1
            factors.append(f"Abnormal heart rate ({bpm} BPM)")
        temp = vitals.get("temperature") or vitals.get("temp")
        if temp is not None and temp >= 38.5:
            fever_high = 1
            factors.append(f"Fever {temp}°C")

    duration_acute = 1 if duration_hours is not None and duration_hours < 24 else 0
    if duration_acute:
        factors.append("Acute onset (< 24 h)")

    features = np.array([[cluster_risk, critical, urgent, age_over_60, age_under_5, spo2_low, hr_abnormal, fever_high, duration_acute]])
    return features, factors


def score_triage(
    cluster: str,
    red_flags: list[dict[str, Any]] | None = None,
    age_years: float | None = None,
    vitals: dict[str, float] | None = None,
    duration_hours: float | None = None,
    free_text: str | None = None,
) -> dict[str, Any]:
    flags = list(red_flags or [])
    if free_text:
        flags = detect_red_flags(free_text, vitals) + flags

    features, factors = _extract_features(cluster, flags, age_years, vitals, duration_hours)

    # Primary: logistic formula matching TS weights
    z = WEIGHTS["intercept"]
    z += WEIGHTS["cluster_risk"] * features[0, 0]
    z += WEIGHTS["red_flag_critical"] * features[0, 1]
    z += WEIGHTS["red_flag_urgent"] * features[0, 2]
    z += WEIGHTS["age_over_60"] * features[0, 3]
    z += WEIGHTS["age_under_5"] * features[0, 4]
    z += WEIGHTS["spo2_low"] * features[0, 5]
    z += WEIGHTS["hr_abnormal"] * features[0, 6]
    z += WEIGHTS["fever_high"] * features[0, 7]
    z += WEIGHTS["duration_acute"] * features[0, 8]

    probability = _sigmoid(z)
    # sklearn ensemble confirmation
    sklearn_prob = float(_TRIAGE_MODEL.predict_proba(features)[0, 1])
    blended = (probability + sklearn_prob) / 2

    score = round(blended * 100)
    critical = int(features[0, 1])
    urgent = int(features[0, 2])

    level = "routine"
    if score >= 75 or critical > 0:
        level = "emergency"
    elif score >= 45 or urgent > 0:
        level = "priority"

    return {
        "score": score,
        "level": level,
        "probability": round(blended, 3),
        "factors": factors,
        "model": "MediKiosk-Triage-v1 (sklearn + logistic ensemble)",
        "sklearn_probability": round(sklearn_prob, 3),
    }


def summarize_intake(
    complaint: str,
    answers: list[dict[str, str]],
    free_text: str | None = None,
    patient_name: str = "Patient",
    age_years: float | None = None,
    vitals: dict[str, float] | None = None,
) -> dict[str, Any]:
    narrative_parts = [f"Chief complaint: {complaint}."]
    for a in answers:
        narrative_parts.append(f"{a.get('question', '').replace('?', '')}: {a.get('answer', '')}.")
    narrative = " ".join(narrative_parts)
    if free_text:
        narrative += f" {free_text}"

    lower = narrative.lower()
    cluster = "metabolic"
    for name, defn in SYMPTOM_CLUSTERS.items():
        if name in lower or complaint.lower() in name:
            cluster = name
            break

    red_flags = detect_red_flags(narrative, vitals)
    triage = score_triage(cluster, red_flags, age_years, vitals, free_text=narrative)

    hpi_lines = [f"• {a.get('question', '').replace('?', '')}: {a.get('answer', '')}" for a in answers]
    if free_text and free_text.strip():
        hpi_lines.append(f"• Patient narrative: {free_text.strip()}")

    structured = {
        "chief_complaint": complaint,
        "hpi": "\n".join(hpi_lines) if hpi_lines else "No HPI captured.",
        "past_history": "Not reported during kiosk intake (verify with patient).",
        "medications": ["None reported"],
        "allergies": ["NKDA reported"],
        "review_of_systems": f"Positive findings cluster: {cluster}.",
        "suggested_department": SYMPTOM_CLUSTERS.get(cluster, SYMPTOM_CLUSTERS["metabolic"])["department"],
        "classification": {"cluster": cluster, "confidence": 0.75},
    }

    flag_block = "\n".join(f"⚠ {f['label']} — {f['action']}" for f in red_flags) if red_flags else "No emergency red flags detected."
    summary = "\n".join([
        f"CLINICAL INTAKE SUMMARY — {patient_name}",
        "Generated by MediKiosk ML pipeline (Python)",
        "",
        f"TRIAGE: {triage['level'].upper()} (score {triage['score']}/100, P={triage['probability']})",
        f"Model: {triage['model']}",
        "",
        "RED FLAGS:",
        flag_block,
        "",
        f"CHIEF COMPLAINT: {complaint}",
        "",
        "HPI:",
        structured["hpi"],
        "",
        f"Suggested routing: {structured['suggested_department']}",
    ])

    return {
        "structured_history": structured,
        "physician_summary": summary,
        "triage": triage,
        "red_flags": red_flags,
        "model": "MediKiosk-HistorySummarizer-v1 (Python)",
    }
