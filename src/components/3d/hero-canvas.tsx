"use client";

import dynamic from "next/dynamic";

const MedicalHeroScene = dynamic(
  () => import("./medical-hero-scene").then((m) => m.MedicalHeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-brand-200/50" />
      </div>
    ),
  }
);

export function HeroCanvas() {
  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-medathon-border bg-gradient-to-br from-slate-900 via-[#0f1729] to-[#0a1628] shadow-card sm:h-[320px] lg:h-full lg:min-h-[340px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(5,150,140,0.25),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(125,59,237,0.2),transparent_45%)]" />
      <div className="absolute inset-0">
        <MedicalHeroScene />
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-md">
        <p className="text-[10px] font-medium uppercase tracking-widest text-brand-300">Live Digital Twin</p>
        <p className="text-xs text-white/80">IoT vitals · AI radiology</p>
      </div>
    </div>
  );
}
