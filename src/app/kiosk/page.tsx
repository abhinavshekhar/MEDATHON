"use client";

import { useState } from "react";
import { parsePatientQr } from "@/lib/patient-qr";
import { vitalsForPatient } from "@/lib/vitals-engine";
import {
  Heart,
  Activity,
  Thermometer,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { ClinicalIntakePanel, type IntakeResult } from "@/components/smart-clinic/clinical-intake-panel";
import type { RedFlag, TriageResult } from "@/lib/ml";

type Patient = {
  id: string;
  patientNo: string;
  name: string;
  ageYears: number | null;
  gender: string;
  district: string | null;
  abhaAddress: string | null;
  visits: { id: string; visitId: string; opdType: string; status: string }[];
};

type Step = "scan" | "profile" | "intake" | "vitals" | "done";

const TRIAGE_COLORS: Record<TriageResult["level"], string> = {
  routine: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  priority: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  emergency: "border-red-500/40 bg-red-500/10 text-red-300",
};

export default function KioskTabletPage() {
  const [step, setStep] = useState<Step>("scan");
  const [input, setInput] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [intake, setIntake] = useState<IntakeResult | null>(null);
  const [vitals, setVitals] = useState<{ bpm: number; spo2: number; temperature: number } | null>(null);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [summarySaved, setSummarySaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchPatient(patientNo: string) {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/patients/lookup/${encodeURIComponent(patientNo)}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Patient not found");
      return;
    }
    setPatient(data);
    setStep("profile");
  }

  function handleScanSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parsePatientQr(input);
    const patientNo = parsed?.patientNo ?? input.trim();
    if (patientNo) fetchPatient(patientNo);
  }

  function handleIntakeComplete(result: IntakeResult) {
    setIntake(result);
    setStep("vitals");
    captureVitals(result);
  }

  async function captureVitals(intakeData?: IntakeResult) {
    if (!patient) return;
    const intakeResult = intakeData ?? intake;
    const age = patient.ageYears ?? 30;
    const v = vitalsForPatient(age, patient.gender);
    setVitals(v);

    await new Promise((r) => setTimeout(r, 2500));

    await fetch("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: patient.id,
        visitId: patient.visits[0]?.id,
        bpm: v.bpm,
        spo2: v.spo2,
        temperature: v.temperature,
      }),
    });

    if (intakeResult) {
      const analyzeRes = await fetch("/api/ai/intake/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint: intakeResult.complaintLabel,
          answers: intakeResult.answers,
          vitals: { bpm: v.bpm, spo2: v.spo2, temp: v.temperature },
        }),
      });
      const analyzeData = await analyzeRes.json();
      const flags: RedFlag[] = analyzeData.redFlags ?? intakeResult.redFlags;
      setRedFlags(flags);

      const triageRes = await fetch("/api/ai/intake/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cluster: intakeResult.classification.cluster,
          redFlags: flags,
          ageYears: patient.ageYears,
          vitals: { bpm: v.bpm, spo2: v.spo2, temperature: v.temperature },
        }),
      });
      const triageData = await triageRes.json();
      setTriage(triageData);

      const summaryRes = await fetch("/api/ai/intake/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint: intakeResult.complaintLabel,
          answers: intakeResult.answers,
          patientName: patient.name,
          gender: patient.gender,
          visitId: patient.visits[0]?.id,
          patientId: patient.id,
          ageYears: patient.ageYears,
          vitals: { bpm: v.bpm, spo2: v.spo2, temperature: v.temperature },
          triage: triageData,
          redFlags: flags,
        }),
      });
      const summaryData = await summaryRes.json();
      setSummarySaved(summaryData.savedToConsultation ?? false);
    }

    setStep("done");
  }

  function resetSession() {
    setStep("scan");
    setPatient(null);
    setIntake(null);
    setVitals(null);
    setTriage(null);
    setRedFlags([]);
    setSummarySaved(false);
    setInput("");
  }

  const avatarHue = patient ? (patient.ageYears ?? 30) * 3 : 180;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col p-6 sm:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Reception station</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Clinical intake & vitals</h1>
          <p className="mt-1 text-sm text-slate-400">
            Scan ABHA QR · ML history interview · capture vitals · sync to physician workspace
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Online
        </div>
      </header>

      {step === "scan" && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <QrCode className="mx-auto h-16 w-16 text-brand-400" />
            <h2 className="mt-6 text-center text-xl font-semibold">Scan appointment or ABDM QR</h2>
            <p className="mt-2 text-center text-sm text-slate-400">Or type patient ID from your mobile app / ID card</p>
            <form onSubmit={handleScanSubmit} className="mt-6 space-y-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="P-CHN-20260915-0001 or paste QR JSON"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-center font-mono text-sm outline-none focus:border-brand-500"
              />
              {error && <p className="text-center text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-500 py-4 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? "Looking up…" : "Fetch patient"}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === "profile" && patient && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full text-5xl font-bold shadow-2xl"
            style={{ background: `hsl(${avatarHue} 60% 45%)` }}
          >
            {patient.name.slice(0, 1)}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold">{patient.name}</h2>
            <p className="mt-2 font-mono text-brand-300">{patient.patientNo}</p>
            <p className="mt-1 text-slate-400">
              {patient.ageYears} yrs · {patient.gender} · {patient.district ?? "Chennai"}
            </p>
            {patient.abhaAddress && <p className="mt-2 text-sm text-slate-500">ABHA: {patient.abhaAddress}</p>}
            {patient.visits[0] && (
              <p className="mt-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm">
                {patient.visits[0].opdType} · {patient.visits[0].status}
              </p>
            )}
          </div>
          <button
            onClick={() => setStep("intake")}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-12 py-5 text-lg font-semibold shadow-lg shadow-brand-500/30 hover:bg-brand-600"
          >
            <Brain className="h-5 w-5" />
            Start clinical history
          </button>
        </div>
      )}

      {step === "intake" && patient && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <ClinicalIntakePanel
            patientName={patient.name}
            onComplete={handleIntakeComplete}
            onBack={() => setStep("profile")}
          />
        </div>
      )}

      {step === "vitals" && vitals && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <p className="animate-pulse text-lg text-brand-300">
            Capturing vitals for {patient?.name}… running ML triage
          </p>
          <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
            {[
              { label: "Heart rate", value: vitals.bpm, unit: "BPM", icon: Heart },
              { label: "SpO₂", value: vitals.spo2, unit: "%", icon: Activity },
              { label: "Temperature", value: vitals.temperature, unit: "°C", icon: Thermometer },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <m.icon className="mx-auto h-8 w-8 text-brand-400" />
                <p className="mt-4 text-4xl font-bold">{m.value}</p>
                <p className="text-sm text-slate-400">{m.unit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "done" && patient && vitals && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <CheckCircle2 className="h-20 w-20 text-emerald-400" />
          <h2 className="text-2xl font-bold">Intake complete — synced to Digital Twin</h2>
          <p className="max-w-md text-slate-400">
            {patient.name} — {vitals.bpm} BPM · {vitals.spo2}% SpO₂ · {vitals.temperature}°C
          </p>

          {triage && (
            <div
              className={`w-full max-w-lg rounded-2xl border p-6 text-left ${TRIAGE_COLORS[triage.level]}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider">ML Triage Score</p>
              <p className="mt-2 text-3xl font-bold">
                {triage.score}/100 · {triage.level}
              </p>
              <p className="mt-1 text-sm opacity-80">{triage.model}</p>
              {triage.factors.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {triage.factors.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {redFlags.length > 0 && (
            <div className="w-full max-w-lg rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-left">
              <p className="flex items-center gap-2 text-sm font-semibold text-red-300">
                <AlertTriangle className="h-4 w-4" />
                Red flags detected ({redFlags.length})
              </p>
              <ul className="mt-3 space-y-2 text-sm text-red-200">
                {redFlags.map((f) => (
                  <li key={f.id}>
                    <strong>{f.label}</strong> — {f.action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {intake && (
            <p className="text-sm text-slate-500">
              Symptom cluster: {intake.classification.cluster} (
              {(intake.classification.confidence * 100).toFixed(0)}% confidence) →{" "}
              {intake.classification.department}
            </p>
          )}

          {summarySaved && (
            <p className="text-sm text-emerald-400">AI physician summary saved to consultation record</p>
          )}

          <button
            onClick={resetSession}
            className="rounded-xl border border-white/20 px-8 py-3 hover:bg-white/10"
          >
            Next patient
          </button>
        </div>
      )}
    </div>
  );
}
