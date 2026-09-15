"use client";

import Link from "next/link";
import { PatientRegistrationForm } from "@/components/patients/patient-registration-form";

export default function PatientAppRegisterPage() {
  return (
    <div className="p-4">
      <Link href="/patient-app" className="text-sm text-brand-700">← Back</Link>
      <h1 className="mt-4 text-xl font-bold">Self registration</h1>
      <p className="mb-6 text-sm text-slate-500">Register for OPD at MEDATHON Chennai clinic</p>
      <PatientRegistrationForm />
    </div>
  );
}
