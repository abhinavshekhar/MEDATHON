"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLES = ["Data Entry", "Doctor", "Lab Technician", "Pharmacist", "Admin"];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("Data Entry");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    sessionStorage.setItem("medathon-role", role);
    setTimeout(() => router.push("/dashboard"), 400);
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[44%] flex-col justify-between bg-[#071421] p-10 text-white lg:flex">
        <Logo variant="light" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
            Staff workspace
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight">
            Hospital operations & clinical intake in one platform
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            Access patient registration, OPD queue, lab workflows, and the Smart Clinic Digital
            Twin. Role-based views keep each team focused.
          </p>
        </div>
        <p className="text-xs text-slate-500">Demo login — authentication wiring coming soon</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Sign in to MEDATHON</h2>
          <p className="mt-2 text-sm text-slate-500">Select your role and enter clinic credentials</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition ${
                      role === r
                        ? "border-brand-500 bg-brand-50 text-brand-800"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Username" placeholder="staff@clinic.gov.in" required />
            <Input label="Password" type="password" placeholder="••••••••" required />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in…" : "Continue to dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 space-y-2 text-center text-sm">
            <Link href="/kiosk" className="block text-brand-700 hover:underline">
              Open reception kiosk →
            </Link>
            <Link href="/" className="block text-slate-400 hover:text-slate-600">
              Back to MediKiosk home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
