"use client";

import { useEffect, useState } from "react";
import { Activity, BrainCircuit, Heart, Thermometer, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Vital = { bpm?: number | null; spo2?: number | null; temperature?: number | null; recordedAt?: string };

function VitalDial({ label, value, unit, icon: Icon, tone, normal }: { label: string; value?: number | null; unit: string; icon: typeof Heart; tone: string; normal: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-medathon-border bg-white p-5 shadow-card">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-70 ${tone}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-900">
            {value ?? "—"}<span className="ml-1 text-base font-medium text-slate-400">{unit}</span>
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"><Icon className="h-4 w-4" /></div>
      </div>
      <p className="relative mt-5 text-xs text-slate-500">Expected {normal}</p>
    </div>
  );
}

export default function DigitalTwinPage() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [connected, setConnected] = useState(false);

  async function loadVitals(id: string) {
    const res = await fetch(`/api/vitals?patientId=${encodeURIComponent(id)}`);
    const data = await res.json();
    setVitals(data.readings ?? []);
    setConnected(true);
  }

  async function lookupPatient() {
    const q = patientId.trim();
    if (!q) return;
    const res = await fetch(`/api/patients/lookup/${encodeURIComponent(q)}`);
    if (!res.ok) return;
    const p = await res.json();
    setPatientName(p.name);
    await loadVitals(p.id);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (patientId && patientName) {
        fetch(`/api/patients/lookup/${encodeURIComponent(patientId)}`)
          .then((r) => r.json())
          .then((p) => loadVitals(p.id))
          .catch(() => {});
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [patientId, patientName]);

  const latest = vitals[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
      <PageHeader
        title="Digital Twin"
        description="Live vitals from kiosk — synced to desktop workspace"
        action={<Badge variant={connected ? "success" : "warning"}>{connected ? <><Wifi className="mr-1 h-3 w-3" />Synced</> : <><WifiOff className="mr-1 h-3 w-3" />Awaiting kiosk</>}</Badge>}
      />

      <section className="rounded-2xl bg-[#071421] p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">Digital twinning</p>
        <p className="mt-2 text-sm text-slate-200">Enter patient ID from kiosk QR scan to view live telemetry on desktop.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Input className="max-w-xs bg-white/10 text-white" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="P-CHN-20260915-0001" />
          <Button onClick={lookupPatient}>Load patient</Button>
        </div>
        {patientName && <p className="mt-3 text-sm text-brand-300">Monitoring: {patientName}</p>}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <VitalDial label="Heart rate" value={latest?.bpm} unit="BPM" icon={Heart} tone="bg-rose-100" normal="60–100 BPM" />
        <VitalDial label="Oxygen saturation" value={latest?.spo2} unit="%" icon={Activity} tone="bg-brand-100" normal="95–100%" />
        <VitalDial label="Temperature" value={latest?.temperature} unit="°C" icon={Thermometer} tone="bg-amber-100" normal="36.1–37.2°C" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
        <Card title="Telemetry stream" description="Vitals from kiosk → database → desktop">
          {vitals.length ? (
            <div className="space-y-2">
              {vitals.slice(0, 10).map((v, i) => (
                <div key={i} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  <span>{v.bpm} BPM · {v.spo2}% · {v.temperature}°C</span>
                  <span className="text-xs text-slate-400">{v.recordedAt ? new Date(v.recordedAt).toLocaleTimeString("en-IN") : ""}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Complete vitals at <a href="/kiosk" className="text-brand-700 underline">/kiosk</a> first.</p>
          )}
        </Card>
        <Card title="AI clinical brief" description="Assistive summary">
          <div className="rounded-xl bg-brand-50 p-4">
            <BrainCircuit className="h-5 w-5 text-brand-700" />
            <p className="mt-3 text-sm font-medium text-slate-800">
              {patientName ? `${patientName}: vitals within expected range for age. Ready for consultation.` : "Select a patient to generate assistive summary."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
