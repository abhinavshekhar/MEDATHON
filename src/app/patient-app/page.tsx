"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartPulse, IdCard, Calendar, FileText, LogOut } from "lucide-react";

type Session = {
  id: string;
  patientNo: string;
  name: string;
  mobile: string | null;
  abhaAddress: string | null;
  visits: { visitId: string; opdType: string; status: string; visitDate: string }[];
  vitalLogs: { bpm: number | null; spo2: number | null; temperature: number | null; recordedAt: string }[];
};

export default function PatientAppPage() {
  const [mobile, setMobile] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("medathon-patient");
    if (saved) setSession(JSON.parse(saved));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/patients?q=${encodeURIComponent(mobile)}`);
    const list = await res.json();
    const match = list.find((p: { mobile?: string }) => p.mobile === mobile);
    if (!match) {
      setError("No patient found with this mobile. Register first.");
      setLoading(false);
      return;
    }
    const detail = await fetch(`/api/patients/${match.id}`).then((r) => r.json());
    const s: Session = {
      id: detail.id,
      patientNo: detail.patientNo,
      name: [detail.firstName, detail.lastName].filter(Boolean).join(" "),
      mobile: detail.mobile,
      abhaAddress: detail.abhaAddress,
      visits: detail.visits ?? [],
      vitalLogs: detail.vitalLogs ?? [],
    };
    localStorage.setItem("medathon-patient", JSON.stringify(s));
    setSession(s);
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("medathon-patient");
    setSession(null);
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col p-6">
        <div className="flex-1 pt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">MEDATHON</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Patient App</h1>
          <p className="mt-2 text-sm text-slate-500">Chennai · Self registration & health records</p>
          <form onSubmit={login} className="mt-10 space-y-4">
            <Input label="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="98XXXXXXXX" required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
          <Link href="/patient-app/register" className="mt-4 block text-center text-sm font-medium text-brand-700">New patient? Register</Link>
          <Link href="/" className="mt-6 block text-center text-xs text-slate-400">Staff desktop app →</Link>
        </div>
      </div>
    );
  }

  const latest = session.vitalLogs[0];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#071421] px-6 py-8 text-white">
        <p className="text-xs text-brand-300">Welcome back</p>
        <h1 className="mt-1 text-xl font-bold">{session.name}</h1>
        <p className="font-mono text-xs text-slate-400">{session.patientNo}</p>
      </header>
      <main className="flex-1 space-y-4 p-4">
        <Link href="/patient-app/abdm" className="flex items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <IdCard className="h-8 w-8 text-brand-600" />
          <div><p className="font-semibold text-slate-900">ABDM Health Card</p><p className="text-xs text-slate-500">View QR · download PDF</p></div>
        </Link>
        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><HeartPulse className="h-4 w-4 text-rose-500" />Latest vitals (kiosk sync)</div>
          {latest ? (
            <p className="mt-3 text-2xl font-bold">{latest.bpm} BPM · {latest.spo2}% · {latest.temperature}°C</p>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Visit the kiosk after registration to capture vitals.</p>
          )}
        </div>
        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><Calendar className="h-4 w-4" />Appointments</div>
          {session.visits.slice(0, 3).map((v) => (
            <div key={v.visitId} className="mt-3 border-t border-slate-50 pt-3 text-sm">
              <p className="font-medium">{v.opdType}</p>
              <p className="text-xs text-slate-500">{v.status} · {new Date(v.visitDate).toLocaleDateString("en-IN")}</p>
            </div>
          ))}
        </div>
        <Link href={`/patients/${session.id}`} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
          <FileText className="h-8 w-8 text-slate-600" />
          <div><p className="font-semibold">Diagnosis & records</p><p className="text-xs text-slate-500">Full history on desktop</p></div>
        </Link>
        <Link href="/kiosk" className="block rounded-xl bg-slate-900 py-3 text-center text-sm font-medium text-white">Open kiosk check-in QR</Link>
      </main>
      <footer className="p-4">
        <button onClick={logout} className="flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-500"><LogOut className="h-4 w-4" />Sign out</button>
      </footer>
    </div>
  );
}
