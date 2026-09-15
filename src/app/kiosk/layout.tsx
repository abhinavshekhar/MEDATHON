import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#071421] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(8,174,227,0.15),transparent)]" />
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-4">
        <Logo variant="light" size="sm" />
        <Link
          href="/"
          className="text-xs font-medium text-slate-400 transition hover:text-white"
        >
          Exit kiosk
        </Link>
      </header>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
