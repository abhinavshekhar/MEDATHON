import Link from "next/link";
import { ArrowRight, ClipboardPlus, HeartPulse, IdCard, ScanLine, Smartphone, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPatientName, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [totalPatients, todayOpd, labPending, vitalsToday, recentPatients, recentVisits] =
    await Promise.all([
      prisma.patient.count(),
      prisma.oPDVisit.count({ where: { visitDate: { gte: today } } }),
      prisma.labOrder.count({ where: { status: { in: ["ORDERED", "COLLECTED", "PROCESSING"] } } }),
      prisma.vitalLog.count({ where: { recordedAt: { gte: today } } }),
      prisma.patient.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.oPDVisit.findMany({
        orderBy: { visitDate: "desc" },
        take: 5,
        include: { patient: true },
      }),
    ]);
  return { totalPatients, todayOpd, labPending, vitalsToday, recentPatients, recentVisits };
}

const ACTIONS = [
  { href: "/opd/registration", icon: UserPlus, title: "New registration", text: "Create an OPD patient record" },
  { href: "/patients", icon: ScanLine, title: "Find a patient", text: "Search records and visit history" },
  { href: "/kiosk", icon: HeartPulse, title: "Kiosk tablet", text: "Reception vitals & QR scan" },
  { href: "/patient-app", icon: Smartphone, title: "Patient mobile app", text: "Self registration & ABDM QR" },
  { href: "/smart-clinic/digital-twin", icon: HeartPulse, title: "Digital Twin", text: "Live vitals monitor" },
  { href: "/smart-clinic/id-scanner", icon: IdCard, title: "Aadhaar ID PDF", text: "Create ID cards with QR" },
];

export default async function DashboardPage() {
  const data = await getDashboardData();
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Clinical overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Today&apos;s operations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {date} · {data.totalPatients.toLocaleString("en-IN")} patients on record
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          <div>
            <p className="text-xs font-semibold text-emerald-900">Kiosk online</p>
            <p className="text-[11px] text-emerald-700">Telemetry channel active</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's OPD" value={data.todayOpd} sub="Registrations since midnight" icon="CalendarDays" trend="Live" />
        <StatCard label="Total patients" value={data.totalPatients} sub="Active records" icon="Users" />
        <StatCard label="Lab queue" value={data.labPending} sub="Awaiting processing" icon="FlaskConical" />
        <StatCard label="Kiosk readings" value={data.vitalsToday} sub="Captured today" icon="HeartPulse" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <Card title="OPD queue" description="Most recent clinical registrations">
          {data.recentVisits.length ? (
            <div className="divide-y divide-slate-100">
              {data.recentVisits.map((visit) => (
                <Link
                  key={visit.id}
                  href={`/patients/${visit.patient.id}`}
                  className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-700">
                    {formatPatientName(visit.patient).slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {formatPatientName(visit.patient)}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {visit.opdType} · {visit.doctorName || "Doctor pending"}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-mono text-[10px] text-slate-500">{visit.visitId}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(visit.visitDate)}</p>
                  </div>
                  <Badge variant={visit.status === "COMPLETED" ? "success" : "warning"}>
                    {visit.status === "REGISTERED" ? "Waiting" : visit.status}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyQueue />
          )}
        </Card>

        <Card title="Quick actions" description="Frequently used workflows">
          <div className="space-y-2">
            {ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.text}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recently registered" description="New patient records">
        {data.recentPatients.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {data.recentPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/30"
              >
                <p className="truncate text-sm font-medium text-slate-800">
                  {formatPatientName(patient)}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-500">{patient.patientNo}</p>
                <p className="mt-2 text-xs text-slate-500">{patient.mobile || "No phone recorded"}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyQueue />
        )}
      </Card>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <ClipboardPlus className="h-7 w-7 text-slate-300" />
      <p className="mt-3 text-sm font-medium text-slate-700">No activity yet</p>
      <p className="mt-1 text-xs text-slate-500">New registrations will appear here.</p>
    </div>
  );
}
