import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  FileScan,
  HeartPulse,
  Languages,
  Mic,
  Shield,
  Smartphone,
  Stethoscope,
  Tablet,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";

const MODULES = [
  {
    title: "Voice + Touch History",
    text: "Adaptive clinical interview with SOCRATES probing, AYUSH Dashavidha mode, and red-flag triage.",
    icon: Mic,
  },
  {
    title: "Document Intelligence",
    text: "OCR for handwritten prescriptions and lab reports with timeline organization.",
    icon: FileScan,
  },
  {
    title: "Physician Summary",
    text: "Structured CC → HPI → PMH draft on the consultation screen before the doctor enters.",
    icon: Stethoscope,
  },
  {
    title: "ABDM Integration",
    text: "ABHA authentication, FHIR push to HIS, and DPDP-compliant consent flows.",
    icon: Shield,
  },
];

const STEPS = [
  { n: "01", title: "Identify", text: "ABHA / Aadhaar login, language selection, audio-guided consent." },
  { n: "02", title: "Converse", text: "AI history interview in Hindi, English, or regional languages." },
  { n: "03", title: "Scan", text: "Upload prior records; AI extracts meds, labs, and diagnoses." },
  { n: "04", title: "Summarize", text: "Summary linked to ABHA and pushed to the hospital EMR." },
  { n: "05", title: "Consult", text: "Doctor reviews, edits, and focuses on examination and care." },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo size="sm" />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#solution" className="transition hover:text-brand-700">Solution</a>
            <a href="#journey" className="transition hover:text-brand-700">Patient journey</a>
            <a href="#platform" className="transition hover:text-brand-700">Platform</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
            >
              Staff login
            </Link>
            <Link
              href="/kiosk"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Open kiosk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-[#071421] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(8,174,227,0.22),transparent)]" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="eyebrow text-brand-300">SIH26047 · Ministry of Ayush</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Clinical history before the consultation begins
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              MediKiosk is an AI-powered intake platform for Indian OPDs — patients record
              comprehensive history by voice or touch, digitize prior records, and deliver a
              physician-ready summary linked to ABHA.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/kiosk"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <Tablet className="h-4 w-4 text-brand-600" />
                Kiosk demo
              </Link>
              <Link
                href="/patient-app"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Smartphone className="h-4 w-4" />
                Patient app
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Staff login
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div>
                <dt className="text-2xl font-bold text-brand-300">2–5 min</dt>
                <dd className="mt-1 text-xs text-slate-400">Avg. OPD consult time in India</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-brand-300">70–80%</dt>
                <dd className="mt-1 text-xs text-slate-400">Diagnoses from history alone</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-brand-300">5 steps</dt>
                <dd className="mt-1 text-xs text-slate-400">Identify to consultation</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-sm font-medium text-slate-200">Live intake session</p>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Recording
                </span>
              </div>
              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="rounded-lg bg-white/5 p-3 text-slate-300">
                  <span className="text-brand-300">AI:</span> When did the chest pain start?
                </div>
                <div className="rounded-lg bg-brand-500/15 p-3 text-slate-200">
                  <span className="text-brand-200">Patient:</span> Since yesterday evening, sharp pain…
                </div>
                <div className="rounded-lg bg-white/5 p-3 text-slate-300">
                  <span className="text-brand-300">AI:</span> Does it spread to your arm or jaw?
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: "HR", value: "78", unit: "bpm" },
                  { label: "SpO₂", value: "98", unit: "%" },
                  { label: "Temp", value: "36.8", unit: "°C" },
                ].map((v) => (
                  <div key={v.label} className="rounded-xl bg-white/5 p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">{v.label}</p>
                    <p className="mt-1 text-lg font-bold text-white">{v.value}</p>
                    <p className="text-[10px] text-slate-500">{v.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solution" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">The problem</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            History-taking is collapsing under OPD volume
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Government hospitals register thousands of patients daily. Physicians have minutes per
            consult while patients carry fragmented paper records. ABDM built the digital backbone —
            but the first mile of structured intake remains unsolved.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod) => (
            <article
              key={mod.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-brand-200 hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <mod.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{mod.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{mod.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="journey" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">End-to-end journey</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Five steps to a complete history</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-5"
              >
                <span className="font-mono text-xs font-bold text-brand-600">{step.n}</span>
                <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="ml" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">ML pipeline</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              On-device clinical intelligence at the kiosk
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              MediKiosk runs a lightweight ML stack at intake — symptom classification, SOCRATES
              probing, red-flag detection, and logistic triage scoring — before the physician
              opens the chart.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Brain,
                title: "Symptom classifier",
                text: "Keyword-cluster NLP maps chief complaints to departments with confidence scores.",
              },
              {
                icon: AlertTriangle,
                title: "Red-flag engine",
                text: "Pattern rules + vitals thresholds flag ACS, stroke, hypoxia, and psychiatric emergencies.",
              },
              {
                icon: HeartPulse,
                title: "Triage scorer",
                text: "Logistic ensemble (TS + sklearn) produces routine / priority / emergency levels.",
              },
              {
                icon: Stethoscope,
                title: "Physician summary",
                text: "Structured CC → HPI → ROS draft saved to the consultation record via Prisma.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-[#0c2d42] p-8 text-white sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
                MEDATHON platform
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Kiosk intake + HIMS + IoT vitals in one stack
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Built for SIH26047 and production clinic deployment — Next.js staff workspace,
                tablet kiosk, patient mobile app, FastAPI AI services, and ESP32 vitals telemetry.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-brand-400" />
                  Hindi, English, and regional language support
                </li>
                <li className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-brand-400" />
                  Live Digital Twin vitals from reception kiosk
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-brand-400" />
                  DPDP 2023 and ABDM consent-first design
                </li>
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/login", label: "Staff HIMS", sub: "Registration, records, MIS" },
                { href: "/kiosk", label: "Reception kiosk", sub: "QR scan + vitals capture" },
                { href: "/patient-app", label: "Patient mobile", sub: "ABDM card & self-reg" },
                { href: "/smart-clinic/digital-twin", label: "Digital Twin", sub: "Live vitals monitor" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-brand-400/40 hover:bg-white/10"
                >
                  <p className="font-semibold text-white group-hover:text-brand-200">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.sub}</p>
                  <ArrowRight className="mt-4 h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-brand-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo size="sm" showTagline={false} />
          <p className="text-center text-xs text-slate-500">
            All India Institute of Ayurveda · Ministry of Ayush · Smart India Hackathon 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
