"use client";

import { ArrowUpRight, CalendarDays, FlaskConical, HeartPulse, Users, type LucideIcon } from "lucide-react";

const ACCENTS = { teal: "bg-brand-50 text-brand-700", violet: "bg-violet-50 text-violet-700", amber: "bg-amber-50 text-amber-700", rose: "bg-rose-50 text-rose-700" } as const;

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
  gradient = "teal",
  trend,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: keyof typeof ICONS;
  gradient?: keyof typeof ACCENTS;
  trend?: string;
}) {
  const Icon = ICONS[icon];

  return (
      <div className="group rounded-2xl border border-medathon-border bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-medathon-muted">{label}</p>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ACCENTS[gradient]}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xs text-slate-400">{sub}</p>
            {trend && <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600"><ArrowUpRight className="h-3 w-3" />{trend}</span>}
          </div>
        </div>
      </div>
  );
}
