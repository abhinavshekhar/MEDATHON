import Link from "next/link";
import type { LabTestResult, OPDVisit, Patient, Prescription, PrescriptionItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatPatientName } from "@/lib/utils";
import { ModuleDef } from "@/lib/module-config";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { IdScannerPanel } from "./id-scanner-panel";
import { AiRadiologyPanel } from "./ai-radiology-panel";
import { UserPlus, ArrowRight } from "lucide-react";

const MEDICINES = [
  "Paracetamol 500mg", "Amoxicillin 250mg", "Azithromycin 500mg", "Cetirizine 10mg",
  "Metformin 500mg", "Amlodipine 5mg", "ORS Sachet", "Vitamin D3 60k",
];

const INVENTORY = MEDICINES.map((name, i) => ({
  name,
  batch: `B2026-${String(i + 1).padStart(3, "0")}`,
  stock: 40 + (i * 17) % 200,
  expiry: `2027-${String((i % 12) + 1).padStart(2, "0")}-15`,
  reorder: (i * 17) % 200 < 60,
}));

async function getModuleData(config: ModuleDef) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (config.kind === "analytics") {
    const [patients, visits, labOrders, prescriptions, vitals] = await Promise.all([
      prisma.patient.count(),
      prisma.oPDVisit.count({ where: { visitDate: { gte: today } } }),
      prisma.labOrder.count(),
      prisma.prescription.count({ where: { status: "PENDING" } }),
      prisma.vitalLog.count({ where: { recordedAt: { gte: today } } }),
    ]);
    const byOpd = await prisma.oPDVisit.groupBy({
      by: ["opdType"],
      _count: true,
      where: { visitDate: { gte: today } },
    });
    const byStatus = await prisma.oPDVisit.groupBy({
      by: ["status"],
      _count: true,
      where: { visitDate: { gte: today } },
    });
    return { patients, visits, labOrders, prescriptions, vitals, byOpd, byStatus };
  }

  if (config.opdType) {
    const visits = await prisma.oPDVisit.findMany({
      where: { opdType: config.opdType },
      orderBy: { visitDate: "desc" },
      take: 50,
      include: { patient: true },
    });
    const todayCount = await prisma.oPDVisit.count({
      where: { opdType: config.opdType, visitDate: { gte: today } },
    });
    return { visits, todayCount };
  }

  if (config.labStatuses) {
    const orders = await prisma.labOrder.findMany({
      where: { status: { in: config.labStatuses } },
      orderBy: { orderedAt: "desc" },
      take: 50,
      include: { patient: true, tests: true },
    });
    const total = await prisma.labOrder.count({ where: { status: { in: config.labStatuses } } });
    return { orders, total };
  }

  if (config.prescriptionStatus) {
    const prescriptions = await prisma.prescription.findMany({
      where: { status: config.prescriptionStatus },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { patient: true, items: true },
    });
    const total = await prisma.prescription.count({ where: { status: config.prescriptionStatus } });
    return { prescriptions, total };
  }

  if (config.path === "abha/profiles") {
    const patients = await prisma.patient.findMany({
      where: { abhaAddress: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const linked = await prisma.patient.count({ where: { abhaAddress: { not: null } } });
    return { patients, linked };
  }

  if (config.path === "radiology" || config.path === "ecg") {
    const visits = await prisma.oPDVisit.findMany({
      orderBy: { visitDate: "desc" },
      take: 40,
      include: { patient: true },
    });
    return { visits };
  }

  if (config.path === "inventory") {
    return { inventory: INVENTORY };
  }

  if (config.path === "admin/roster") {
    const doctors = await prisma.oPDVisit.groupBy({
      by: ["doctorName"],
      _count: true,
      where: { doctorName: { not: null }, visitDate: { gte: today } },
    });
    return { doctors };
  }

  return {};
}

type VisitWithPatient = OPDVisit & { patient: Patient };
type LabOrderRow = { id: string; priority: string; status: string; orderedAt: Date; patient: Patient; tests: LabTestResult[] };
type PrescriptionRow = Prescription & { patient: Patient; items: PrescriptionItem[] };

function VisitTable({ visits }: { visits: VisitWithPatient[] }) {
  if (!visits.length) {
    return <p className="text-sm text-slate-500">No records in this queue.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
            <th className="pb-3 pr-4">Patient</th>
            <th className="pb-3 pr-4">Visit ID</th>
            <th className="pb-3 pr-4">Doctor</th>
            <th className="pb-3 pr-4">Reason</th>
            <th className="pb-3 pr-4">Time</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v) => (
            <tr key={v.id} className="border-b border-slate-50 hover:bg-brand-50/30">
              <td className="py-3 pr-4">
                <Link href={`/patients/${v.patientId}`} className="font-medium text-slate-900 hover:text-brand-700">
                  {formatPatientName(v.patient)}
                </Link>
                <p className="font-mono text-[10px] text-slate-400">{v.patient.patientNo}</p>
              </td>
              <td className="py-3 pr-4 font-mono text-xs text-slate-500">{v.visitId}</td>
              <td className="py-3 pr-4 text-slate-600">{v.doctorName ?? "—"}</td>
              <td className="py-3 pr-4 text-slate-600">{v.reason}</td>
              <td className="py-3 pr-4 text-slate-500">{formatDateTime(v.visitDate)}</td>
              <td className="py-3">
                <Badge variant={v.status === "COMPLETED" ? "success" : "warning"}>{v.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function ModulePage({ config }: { config: ModuleDef }) {
  const data = await getModuleData(config);

  if (config.kind === "tool") {
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        {config.path === "smart-clinic/id-scanner" ? <IdScannerPanel /> : <AiRadiologyPanel />}
      </div>
    );
  }

  if (config.kind === "analytics") {
    const d = data as {
      patients: number;
      visits: number;
      labOrders: number;
      prescriptions: number;
      vitals: number;
      byOpd: { opdType: string; _count: number }[];
      byStatus: { status: string; _count: number }[];
    };
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total patients" value={d.patients} sub="All time" icon="Users" gradient="violet" />
          <StatCard label="Today's OPD" value={d.visits} sub="Since midnight" icon="CalendarDays" gradient="teal" trend="Live" />
          <StatCard label="Lab orders" value={d.labOrders} sub="All statuses" icon="FlaskConical" gradient="amber" />
          <StatCard label="Rx pending" value={d.prescriptions} sub="Pharmacy queue" icon="HeartPulse" gradient="rose" />
          <StatCard label="Kiosk vitals" value={d.vitals} sub="Today" icon="HeartPulse" gradient="teal" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="OPD by department" description="Today's registrations">
            <div className="space-y-3">
              {d.byOpd.map((row) => (
                <div key={row.opdType} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                  <span className="text-sm font-medium text-slate-800">{row.opdType}</span>
                  <Badge variant="info">{row._count}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Visit status" description="Today's pipeline">
            <div className="space-y-3">
              {d.byStatus.map((row) => (
                <div key={row.status} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                  <span className="text-sm font-medium text-slate-800">{row.status}</span>
                  <Badge variant="warning">{row._count}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (config.kind === "registration") {
    const d = data as { visits: VisitWithPatient[]; todayCount: number };
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader
          title={config.title}
          description={config.description}
          action={
            <Link href={config.registrationHref ?? "/opd/registration"}>
              <Button><UserPlus className="h-4 w-4" />New registration</Button>
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Registered today" value={d.todayCount} sub={config.opdType ?? "OPD"} icon="CalendarDays" gradient="teal" />
          <StatCard label="In queue" value={d.visits.filter((v) => v.status !== "COMPLETED").length} sub="Active visits" icon="Users" gradient="violet" />
          <StatCard label="Completed" value={d.visits.filter((v) => v.status === "COMPLETED").length} sub="This module" icon="HeartPulse" gradient="amber" />
        </div>
        <Card title={`${config.opdType} registrations`} description="Most recent visits">
          <VisitTable visits={d.visits} />
        </Card>
      </div>
    );
  }

  if (config.kind === "queue") {
    const d = data as { visits: VisitWithPatient[]; todayCount?: number };
    const visits = d.visits ?? [];
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <Card title="Live queue" description={`${visits.length} patients`}>
          <VisitTable visits={visits} />
        </Card>
      </div>
    );
  }

  if (config.path === "abha/profiles") {
    const d = data as { patients: Awaited<ReturnType<typeof prisma.patient.findMany>>; linked: number };
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <StatCard label="ABHA linked" value={d.linked} sub="Patient profiles" icon="Users" gradient="teal" />
        <Card title="Shared profiles" description="Patients with digital health ID">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">ABHA address</th>
                  <th className="pb-3 pr-4">Mobile</th>
                  <th className="pb-3">District</th>
                </tr>
              </thead>
              <tbody>
                {d.patients.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-brand-50/30">
                    <td className="py-3 pr-4">
                      <Link href={`/patients/${p.id}`} className="font-medium hover:text-brand-700">{formatPatientName(p)}</Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-brand-700">{p.abhaAddress}</td>
                    <td className="py-3 pr-4">{p.mobile}</td>
                    <td className="py-3">{p.district}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  if (config.labStatuses) {
    const d = data as { orders: LabOrderRow[]; total: number };
    const isDengue = config.path === "lab/dengue";
    const orders = isDengue
      ? d.orders.filter((o) => o.tests.some((t) => t.testName.toLowerCase().includes("dengue")))
      : d.orders;

    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <StatCard label="In pipeline" value={isDengue ? orders.length : d.total} sub="Current module" icon="FlaskConical" gradient="amber" />
        <Card title="Orders" description={isDengue ? "Dengue and notifiable disease cases" : "Lab workflow queue"}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">Tests</th>
                  <th className="pb-3 pr-4">Priority</th>
                  <th className="pb-3 pr-4">Ordered</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-brand-50/30">
                    <td className="py-3 pr-4 font-medium">{formatPatientName(o.patient)}</td>
                    <td className="py-3 pr-4 text-slate-600">{o.tests.map((t) => t.testName).join(", ")}</td>
                    <td className="py-3 pr-4"><Badge variant={o.priority === "URGENT" ? "warning" : "info"}>{o.priority}</Badge></td>
                    <td className="py-3 pr-4 text-slate-500">{formatDateTime(o.orderedAt)}</td>
                    <td className="py-3"><Badge variant="success">{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  if (config.prescriptionStatus) {
    const d = data as { prescriptions: PrescriptionRow[]; total: number };
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <StatCard label="Pending Rx" value={d.total} sub="Awaiting action" icon="HeartPulse" gradient="rose" />
        <Card title="Prescription queue" description="Review and dispense">
          <div className="space-y-3">
            {d.prescriptions.map((rx) => (
              <div key={rx.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{formatPatientName(rx.patient)}</p>
                  <p className="mt-1 text-xs text-slate-500">{rx.doctorName} · {rx.items.map((i) => i.medicineName).join(", ")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{rx.status}</Badge>
                  <Button size="sm" variant="secondary">Dispense</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (config.path === "inventory") {
    const d = data as { inventory: typeof INVENTORY };
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <Card title="Stock ledger" description="Pharmacy inventory snapshot">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Medicine</th>
                  <th className="pb-3 pr-4">Batch</th>
                  <th className="pb-3 pr-4">Stock</th>
                  <th className="pb-3 pr-4">Expiry</th>
                  <th className="pb-3">Alert</th>
                </tr>
              </thead>
              <tbody>
                {d.inventory.map((row) => (
                  <tr key={row.name} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium">{row.name}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{row.batch}</td>
                    <td className="py-3 pr-4">{row.stock}</td>
                    <td className="py-3 pr-4">{row.expiry}</td>
                    <td className="py-3">{row.reorder ? <Badge variant="warning">Reorder</Badge> : <Badge variant="success">OK</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  if (config.path === "admin/roster") {
    const d = data as { doctors: { doctorName: string | null; _count: number }[] };
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <Card title="Today's OPD roster" description="Doctors on duty and patient load">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.doctors.map((doc) => (
              <div key={doc.doctorName} className="rounded-xl border border-slate-100 p-4">
                <p className="font-medium text-slate-900">{doc.doctorName}</p>
                <p className="mt-1 text-sm text-slate-500">{doc._count} patients today</p>
                <Badge variant="success" className="mt-3">On duty</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (config.path === "radiology" || config.path === "ecg") {
    const d = data as { visits: VisitWithPatient[] };
    return (
      <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
        <PageHeader title={config.title} description={config.description} />
        <Card title="Order queue" description={config.path === "ecg" ? "ECG capture waiting list" : "Imaging orders awaiting modality"}>
          <VisitTable visits={d.visits.slice(0, 30)} />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
      <PageHeader title={config.title} description={config.description} />
      <Card title="Workspace">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-brand-700 hover:underline">
          Return to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  );
}
