import { prisma } from "@/lib/prisma";
import { formatDateTime, formatPatientName } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

async function getKioskData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [kiosk, vitalsToday, recentVitals] = await Promise.all([
    prisma.kioskDevice.findFirst({ include: { clinic: true } }),
    prisma.vitalLog.count({ where: { recordedAt: { gte: today } } }),
    prisma.vitalLog.findMany({
      orderBy: { recordedAt: "desc" },
      take: 25,
      include: { patient: true, kiosk: true },
    }),
  ]);

  return { kiosk, vitalsToday, recentVitals };
}

export default async function KioskPage() {
  const data = await getKioskData();

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
      <PageHeader
        title="Vitals Kiosk Monitor"
        description="Live BPM, SpO2, and temperature from ESP32 reception kiosk"
        action={
          <Badge variant={data.kiosk?.isOnline ? "success" : "warning"}>
            {data.kiosk?.isOnline ? "Kiosk online" : "Kiosk offline"}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Readings today" value={data.vitalsToday} sub="All patients" icon="HeartPulse" gradient="rose" />
        <StatCard label="Device" value={data.kiosk?.name ?? "—"} sub={data.kiosk?.deviceId ?? "No device"} icon="Users" gradient="teal" />
        <StatCard label="Clinic" value={data.kiosk?.clinic.name ?? "—"} sub="Connected site" icon="CalendarDays" gradient="violet" />
      </div>

      <Card title="Recent vitals stream" description="Latest kiosk captures">
        {data.recentVitals.length === 0 ? (
          <p className="text-sm text-slate-500">No vitals recorded yet. Connect the ESP32 kiosk or run the AI API.</p>
        ) : (
          <div className="space-y-2">
            {data.recentVitals.map((v) => (
              <div key={v.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/patients/${v.patientId}`} className="font-medium text-slate-900 hover:text-brand-700">
                    {formatPatientName(v.patient)}
                  </Link>
                  <p className="text-xs text-slate-500">{v.kiosk?.name ?? "Kiosk"} · {formatDateTime(v.recordedAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="info">{v.bpm ?? "—"} BPM</Badge>
                  <Badge variant="success">{v.spo2 ?? "—"}% SpO2</Badge>
                  <Badge variant="warning">{v.temperature ?? "—"} °C</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-4">
        <Link href="/kiosk" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Open tablet kiosk screen (11&quot;)
        </Link>
        <Link href="/smart-clinic/digital-twin" className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline">
          <HeartPulse className="h-4 w-4" />
          Digital Twin workspace
        </Link>
        <Link href="/patient-app" className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline">
          Patient mobile app
        </Link>
      </div>
    </div>
  );
}
