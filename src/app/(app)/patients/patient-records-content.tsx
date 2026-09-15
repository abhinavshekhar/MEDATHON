"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, Skeleton } from "@/components/ui/empty-state";
import { formatPatientName } from "@/lib/utils";
import { Search, UserPlus, Users, CheckCircle2, X } from "lucide-react";

type PatientRow = {
  id: string;
  patientNo: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  gender: string;
  ageYears?: number | null;
  mobile?: string | null;
  district?: string | null;
  visits: { visitId: string; opdType: string; doctorName?: string | null; status: string }[];
};

export default function PatientRecordsContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(registered);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/patients?q=${encodeURIComponent(query)}`);
      setPatients(await res.json());
      setLoading(false);
    }
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-slide-up">
      <PageHeader
        title="Patient Records"
        description={`${patients.length} patient${patients.length !== 1 ? "s" : ""} found`}
        action={
          <Link href="/opd/registration">
            <Button><UserPlus className="h-4 w-4" />New Registration</Button>
          </Link>
        }
      />

      {toast && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Patient <strong>{toast}</strong> registered successfully.
          </div>
          <button onClick={() => setToast(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <Card>
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search by name, patient no, or mobile…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : patients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No patients found"
            description={query ? "Try a different search term." : "Register your first patient to get started."}
            action={
              <Link href="/opd/registration">
                <Button><UserPlus className="h-4 w-4" />Register Patient</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Gender</th>
                  <th className="pb-3 pr-4">Age</th>
                  <th className="pb-3 pr-4">Contact</th>
                  <th className="pb-3 pr-4">District</th>
                  <th className="pb-3">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="group border-b border-slate-50 transition hover:bg-brand-50/30">
                    <td className="py-3.5 pr-4">
                      <Link href={`/patients/${p.id}`} className="font-medium text-slate-900 hover:text-brand-700">
                        {formatPatientName(p)}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-xs text-slate-500">{p.patientNo}</td>
                    <td className="py-3.5 pr-4"><Badge variant="info">{p.gender}</Badge></td>
                    <td className="py-3.5 pr-4 text-slate-600">{p.ageYears ?? "—"}</td>
                    <td className="py-3.5 pr-4 text-slate-600">{p.mobile ?? "—"}</td>
                    <td className="py-3.5 pr-4 text-slate-600">{p.district ?? "—"}</td>
                    <td className="py-3.5">
                      {p.visits[0] ? (
                        <div>
                          <p className="text-slate-700">{p.visits[0].opdType}</p>
                          <p className="text-xs text-slate-400">{p.visits[0].doctorName}</p>
                        </div>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
