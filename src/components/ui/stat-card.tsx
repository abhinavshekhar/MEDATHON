"use client";

import { ArrowUpRight, CalendarDays, FlaskConical, HeartPulse, Users, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  CalendarDays,
  Users,
  FlaskConical,
  HeartPulse,
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
  gradient: _gradient,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: keyof typeof ICONS;
  trend?: string;
  /** @deprecated accent is unified; kept for call-site compatibility */
  gradient?: string;
}) {
  const Icon = ICONS[icon];

  return (
    <div className="rounded-2xl border border-medathon-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-medathon-muted">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-xs text-slate-400">{sub}</p>
        {trend && (
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
