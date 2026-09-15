import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPatientName, formatDate, formatDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowLeft, Heart, Phone, MapPin, Calendar, Stethoscope, Activity, UserPlus } from "lucide-react";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      visits: { orderBy: { visitDate: "desc" } },
      vitalLogs: { orderBy: { recordedAt: "desc" }, take: 5 },
    },
  });

  if (!patient) notFound();

  const latestVitals = patient.vitalLogs[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-slide-up">
      <PageHeader
        title={formatPatientName(patient)}
        description={patient.patientNo}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/smart-clinic/digital-twin">
              <Button variant="secondary"><Activity className="h-4 w-4" />Digital Twin</Button>
            </Link>
            <Link href="/patients">
              <Button variant="secondary"><ArrowLeft className="h-4 w-4" />Back</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
            <Phone className="h-4 w-4 text-brand-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Mobile</p>
            <p className="text-sm font-medium">{patient.mobile ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
            <MapPin className="h-4 w-4 text-brand-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">District</p>
            <p className="text-sm font-medium">{patient.district ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
            <Calendar className="h-4 w-4 text-brand-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Age</p>
            <p className="text-sm font-medium">{patient.ageYears ? `${patient.ageYears} years` : "—"}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="info">{patient.gender}</Badge>
        {patient.schemePMJAY && <Badge variant="success">PMJAY</Badge>}
        {patient.schemeBPL && <Badge variant="warning">BPL</Badge>}
        {patient.email && <Badge variant="violet">{patient.email}</Badge>}
      </div>

      {patient.address && (
        <p className="text-sm text-slate-500">{patient.address}</p>
      )}

      <Card title="Visit History" description={`${patient.visits.length} visit(s)`}>
        {patient.visits.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-slate-400">No visits recorded.</p>
            <Link href="/opd/registration" className="mt-3 inline-block">
              <Button size="sm"><UserPlus className="h-4 w-4" />New Visit</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {patient.visits.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-brand-100 hover:bg-brand-50/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
                    <Stethoscope className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{v.opdType} — {v.doctorName}</p>
                    <p className="text-xs text-slate-400">
                      {v.visitId} · {v.reason} · {formatDate(v.visitDate)}
                    </p>
                  </div>
                </div>
                <Badge variant={v.status === "COMPLETED" ? "success" : "warning"}>{v.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Vitals (Kiosk)" description="Latest readings from Smart Clinic kiosk">
        {!latestVitals ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <Heart className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No vitals recorded yet.</p>
            <p className="mt-1 text-xs text-slate-400">Send patient to reception kiosk after registration.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-rose-50 p-4 text-center">
                <Heart className="mx-auto h-5 w-5 text-rose-500" />
                <p className="mt-2 text-2xl font-bold text-slate-900">{latestVitals.bpm ?? "—"}</p>
                <p className="text-xs text-slate-500">BPM</p>
              </div>
              <div className="rounded-xl bg-brand-50 p-4 text-center">
                <p className="mt-7 text-2xl font-bold text-slate-900">{latestVitals.spo2 ?? "—"}%</p>
                <p className="text-xs text-slate-500">SpO2</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <p className="mt-7 text-2xl font-bold text-slate-900">{latestVitals.temperature ?? "—"}°</p>
                <p className="text-xs text-slate-500">Temp</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Last recorded {formatDateTime(latestVitals.recordedAt)}
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
