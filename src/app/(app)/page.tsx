import Link from "next/link";
import { ArrowRight, ClipboardPlus, HeartPulse, IdCard, ScanLine, Smartphone, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPatientName, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

async function getDashboardData() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [totalPatients, todayOpd, labPending, vitalsToday, recentPatients, recentVisits] = await Promise.all([
    prisma.patient.count(), prisma.oPDVisit.count({ where: { visitDate: { gte: today } } }),
    prisma.labOrder.count({ where: { status: { in: ["ORDERED", "COLLECTED", "PROCESSING"] } } }),
    prisma.vitalLog.count({ where: { recordedAt: { gte: today } } }),
    prisma.patient.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.oPDVisit.findMany({ orderBy: { visitDate: "desc" }, take: 5, include: { patient: true } }),
  ]);
  return { totalPatients, todayOpd, labPending, vitalsToday, recentPatients, recentVisits };
}

const ACTIONS = [
  { href: "/opd/registration", icon: UserPlus, title: "New registration", text: "Create an OPD patient record" },
  { href: "/patients", icon: ScanLine, title: "Find a patient", text: "Search records and visit history" },
  { href: "/kiosk", icon: HeartPulse, title: "Kiosk tablet", text: "11″ reception vitals station" },
  { href: "/patient-app", icon: Smartphone, title: "Patient mobile app", text: "Self registration & ABDM QR" },
  { href: "/smart-clinic/digital-twin", icon: HeartPulse, title: "Digital Twin", text: "Desktop vitals monitor" },
  { href: "/smart-clinic/id-scanner", icon: IdCard, title: "Aadhaar ID PDF", text: "Create ID cards with QR" },
];

export default async function DashboardPage() {
  const data = await getDashboardData();
  const date = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  return <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
    <section className="rounded-2xl bg-[#071421] px-6 py-6 text-white shadow-xl shadow-slate-900/10 sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">MEDATHON · Chennai</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Clinical command center</h1><p className="mt-2 text-sm text-slate-300">{date} · {data.totalPatients.toLocaleString("en-IN")} patients · Tamil Nadu</p></div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span><div><p className="text-xs font-medium">Reception kiosk online</p><p className="text-[11px] text-slate-400">Telemetry channel ready</p></div></div>
      </div>
    </section>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Today's OPD" value={data.todayOpd} sub="Registrations since 00:00" icon="CalendarDays" gradient="teal" trend="Live" />
      <StatCard label="Patients" value={data.totalPatients} sub="Records in the clinic" icon="Users" gradient="violet" />
      <StatCard label="Lab queue" value={data.labPending} sub="Samples awaiting action" icon="FlaskConical" gradient="amber" />
      <StatCard label="Kiosk readings" value={data.vitalsToday} sub="Vitals captured today" icon="HeartPulse" gradient="rose" />
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
      <Card title="OPD queue" description="Most recent clinical registrations">
        {data.recentVisits.length ? <div className="divide-y divide-slate-100">{data.recentVisits.map((visit) => <Link key={visit.id} href={`/patients/${visit.patient.id}`} className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">{formatPatientName(visit.patient).slice(0, 1)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{formatPatientName(visit.patient)}</p><p className="truncate text-xs text-slate-500">{visit.opdType} · {visit.doctorName || "Doctor pending"}</p></div><div className="hidden text-right sm:block"><p className="font-mono text-[10px] text-slate-500">{visit.visitId}</p><p className="mt-1 text-[11px] text-slate-400">{formatDateTime(visit.visitDate)}</p></div><Badge variant={visit.status === "COMPLETED" ? "success" : "warning"}>{visit.status === "REGISTERED" ? "Waiting" : visit.status}</Badge></Link>)}</div> : <EmptyQueue />}
      </Card>
      <Card title="Quick actions" description="Frequently used workflows"><div className="space-y-2">{ACTIONS.map((action) => <Link key={action.href} href={action.href} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700"><action.icon className="h-4 w-4" /></div><div className="flex-1"><p className="text-sm font-medium text-slate-800">{action.title}</p><p className="text-xs text-slate-500">{action.text}</p></div><ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600" /></Link>)}</div></Card>
    </div>
    <Card title="Recently registered" description="New patient records in chronological order">{data.recentPatients.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{data.recentPatients.map((patient) => <Link key={patient.id} href={`/patients/${patient.id}`} className="rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/30"><p className="truncate text-sm font-medium text-slate-800">{formatPatientName(patient)}</p><p className="mt-1 font-mono text-[10px] text-slate-500">{patient.patientNo}</p><p className="mt-2 text-xs text-slate-500">{patient.mobile || "No phone recorded"}</p></Link>)}</div> : <EmptyQueue />}</Card>
  </div>;
}

function EmptyQueue() { return <div className="flex flex-col items-center justify-center py-10 text-center"><ClipboardPlus className="h-7 w-7 text-brand-300" /><p className="mt-3 text-sm font-medium text-slate-700">No activity yet</p><p className="mt-1 text-xs text-slate-500">New registrations will appear here.</p></div>; }
