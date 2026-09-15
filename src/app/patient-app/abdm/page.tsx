"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { buildPatientQrPayload } from "@/lib/patient-qr";
import { Button } from "@/components/ui/button";

export default function AbdmCardPage() {
  const [qr, setQr] = useState("");
  const [session, setSession] = useState<{ name: string; patientNo: string; abhaAddress?: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("medathon-patient");
    if (!saved) return;
    const s = JSON.parse(saved);
    setSession(s);
    const payload = buildPatientQrPayload({ patientNo: s.patientNo, patientId: s.id, name: s.name, abhaAddress: s.abhaAddress });
    QRCode.toDataURL(JSON.stringify(payload), { width: 220, margin: 2 }).then(setQr);
  }, []);

  if (!session) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Sign in first</p>
        <Link href="/patient-app" className="mt-4 text-brand-700">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link href="/patient-app" className="text-sm text-brand-700">← Home</Link>
      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-2 text-center text-xs font-bold text-white">ABDM · Ayushman Bharat Digital Mission</div>
        <div className="p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold">{session.name.slice(0, 1)}</div>
          <h2 className="mt-4 text-lg font-bold">{session.name}</h2>
          <p className="font-mono text-xs text-slate-600">{session.patientNo}</p>
          {session.abhaAddress && <p className="mt-2 text-sm text-brand-700">{session.abhaAddress}</p>}
          {qr && <img src={qr} alt="ABDM QR" className="mx-auto mt-6 rounded-lg border border-slate-200" />}
          <p className="mt-4 text-xs text-slate-500">Scan at kiosk for check-in & vitals</p>
        </div>
      </div>
      <Link href="/kiosk"><Button className="mt-6 w-full">Show at kiosk</Button></Link>
    </div>
  );
}
