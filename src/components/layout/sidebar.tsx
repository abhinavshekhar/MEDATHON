"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity, Baby, BarChart3, Bug, Calendar, CheckCircle, ChevronDown,
  FileText, FlaskConical, FolderOpen, Heart, HeartPulse, IdCard,
  LayoutDashboard, ListOrdered, Package, Pill, Scan, ScanLine, Siren,
  UserPlus, Warehouse, X, type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { HIMS_MODULES, type ModuleCategory } from "@/types/hims";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  UserPlus, IdCard, FolderOpen, Baby, Heart, Siren, ListOrdered, Pill, Package,
  FlaskConical, CheckCircle, FileText, Bug, Scan, Activity, Warehouse,
  Calendar, BarChart3, HeartPulse, ScanLine, LayoutDashboard,
};

const PRIMARY_CATEGORIES: ModuleCategory[] = [
  "OPD",
  "Patient Management",
  "Pharmacy",
  "Lab",
  "Smart Clinic",
];

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ "Smart Clinic": true });

  const toggle = (cat: string) =>
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const handleNav = () => onMobileClose?.();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[248px] flex-col border-r border-white/5 bg-medathon-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/dashboard" onClick={handleNav}>
            <Logo variant="light" size="sm" showTagline={false} />
          </Link>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <Link
            href="/dashboard"
            onClick={handleNav}
            className={cn(
              "mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              pathname === "/dashboard"
                ? "bg-white/10 text-white"
                : "text-medathon-nav-muted hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {PRIMARY_CATEGORIES.map((category) => {
            const modules = HIMS_MODULES.filter((m) => m.category === category);
            if (!modules.length) return null;
            const isCollapsed = collapsed[category];

            return (
              <div key={category} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggle(category)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-400"
                >
                  {category}
                  <ChevronDown className={cn("h-3 w-3 transition", isCollapsed && "-rotate-90")} />
                </button>
                {!isCollapsed &&
                  modules.map((mod) => {
                    const Icon = ICONS[mod.icon] ?? LayoutDashboard;
                    const active =
                      pathname === mod.href || pathname.startsWith(mod.href + "/");
                    return (
                      <Link
                        key={mod.id}
                        href={mod.href}
                        onClick={handleNav}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                          active
                            ? "bg-brand-600/20 font-medium text-medathon-nav-active"
                            : "text-medathon-nav-muted hover:bg-white/5 hover:text-slate-200"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{mod.label}</span>
                      </Link>
                    );
                  })}
              </div>
            );
          })}

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              More modules
            </p>
            {HIMS_MODULES.filter((m) => !PRIMARY_CATEGORIES.includes(m.category)).map((mod) => {
              const Icon = ICONS[mod.icon] ?? LayoutDashboard;
              const active = pathname === mod.href || pathname.startsWith(mod.href + "/");
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  onClick={handleNav}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-brand-600/20 font-medium text-medathon-nav-active"
                      : "text-medathon-nav-muted hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{mod.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/kiosk"
            className="block rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 transition hover:bg-brand-500/15"
          >
            <p className="text-xs font-semibold text-brand-200">MediKiosk tablet</p>
            <p className="mt-1 text-[10px] text-slate-400">Open reception intake station</p>
          </Link>
        </div>
      </aside>
    </>
  );
}
