"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, User, MapPin, Stethoscope } from "lucide-react";

const STEPS = [
  { id: 1, label: "Patient", icon: User },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "OPD Visit", icon: Stethoscope },
];

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const OPD_TYPES = [
  { value: "General OPD", label: "General OPD" },
  { value: "MCH", label: "MCH" },
  { value: "Pediatric", label: "Pediatric" },
  { value: "Emergency", label: "Emergency" },
];

const DOCTORS = [
  { value: "Dr. Sharma", label: "Dr. Sharma" },
  { value: "Dr. Patel", label: "Dr. Patel" },
  { value: "Dr. Kumar", label: "Dr. Kumar" },
];

export function PatientRegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 3) {
      const form = e.currentTarget;
      if (step === 1) {
        const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)?.value.trim();
        const gender = (form.elements.namedItem("gender") as HTMLSelectElement)?.value;
        if (!firstName || !gender) {
          setError("Please fill in required fields before continuing.");
          return;
        }
      }
      setError("");
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: form.get("firstName") as string,
      middleName: form.get("middleName") as string,
      lastName: form.get("lastName") as string,
      ageYears: Number(form.get("ageYears") || 0),
      gender: form.get("gender") as string,
      mobile: form.get("mobile") as string,
      email: form.get("email") as string,
      district: form.get("district") as string,
      address: form.get("address") as string,
      opdType: form.get("opdType") as string,
      doctorName: form.get("doctorName") as string,
      referredBy: form.get("referredBy") as string,
      reason: form.get("reason") as string,
      feeAmount: Number(form.get("feeAmount") || 0),
      paymentCollected: form.get("paymentCollected") === "on",
      schemePMJAY: form.get("schemePMJAY") === "on",
      schemeBPL: form.get("schemeBPL") === "on",
    };

    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push(`/patients?registered=${data.patient.patientNo}`), 1200);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Patient Registered!</h2>
        <p className="mt-1 text-sm text-slate-500">Redirecting to patient records…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                step === s.id
                  ? "bg-brand-600 text-white shadow-sm"
                  : step > s.id
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              {s.label}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === 1 && (
        <Card title="Patient Details" description="Step 1 of 3 — Basic demographic information">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input id="firstName" name="firstName" label="First Name *" required />
            <Input id="middleName" name="middleName" label="Middle Name" />
            <Input id="lastName" name="lastName" label="Last Name" />
            <Input id="ageYears" name="ageYears" label="Age (Years)" type="number" min={0} />
            <Select id="gender" name="gender" label="Gender *" options={GENDERS} required />
            <Input id="mobile" name="mobile" label="Mobile" type="tel" placeholder="10-digit number" />
            <Input id="email" name="email" label="Email" type="email" />
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card title="Address" description="Step 2 of 3 — Location details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input id="district" name="district" label="District" />
            <Input id="address" name="address" label="Full Address" />
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card title="OPD Details" description="Step 3 of 3 — Visit and doctor assignment">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select id="opdType" name="opdType" label="OPD Type *" options={OPD_TYPES} required />
            <Select id="doctorName" name="doctorName" label="Doctor *" options={DOCTORS} required />
            <Input id="referredBy" name="referredBy" label="Referred By *" defaultValue="Self" required />
            <Input id="reason" name="reason" label="Reason for Visit *" required placeholder="Chief complaint" />
            <Input id="feeAmount" name="feeAmount" label="Fee (₹)" type="number" min={0} defaultValue="0" />
            <div className="flex flex-col gap-3 pt-2">
              {["paymentCollected", "schemePMJAY", "schemeBPL"].map((name) => (
                <label key={name} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <input type="checkbox" name={name} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
                  {name === "paymentCollected" ? "Payment collected" : name === "schemePMJAY" ? "PMJAY scheme" : "BPL scheme"}
                </label>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Registering…" : step < 3 ? "Continue" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
}
