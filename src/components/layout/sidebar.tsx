"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity, Baby, BarChart3, Bug, Calendar, CheckCircle, ChevronDown,
  FileText, FlaskConical, FolderOpen, Heart, HeartPulse, IdCard,
  LayoutDashboard, ListOrdered, MessageSquare, Package, Pill, Scan, ScanLine, Siren,
  UserPlus, Warehouse, X, type LucideIcon,
} from "lucide-react";
import { HIMS_MODULES, type ModuleCategory } from "@/types/hims";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  UserPlus, IdCard, FolderOpen, Baby, Heart, Siren, ListOrdered, Pill, Package,
  FlaskConical, CheckCircle, FileText, Bug, Scan, Activity, Warehouse,
  Calendar, BarChart3, HeartPulse, ScanLine, LayoutDashboard, MessageSquare,
};

const PRIMARY_CATEGORIES: ModuleCategory[] = ["OPD", "Patient Management", "Pharmacy", "Lab", "Smart Clinic"];

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
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col bg-medathon-sidebar text-medathon-nav-muted transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-500 text-sm font-bold text-white shadow-lg shadow-brand-500/20">
              <span className="relative z-10">+</span><span className="absolute h-10 w-1 bg-white/90" /><span className="absolute h-1 w-10 bg-white/90" />
            </div>
            <div>
              <p className="font-bold tracking-[0.12em] text-white">MEDATHON</p>
              <p className="text-[10px] text-medathon-nav-muted">CLINICAL OS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          <Link
            href="/"
            onClick={handleNav}
            className={cn(
              "mb-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            pathname === "/"
              ? "bg-brand-600/20 text-medathon-nav-active"
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
                {!isCollapsed && modules.map((mod) => {
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
                      <span className="flex-1 truncate">{mod.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Operations</p>
            {HIMS_MODULES.filter((m) => !PRIMARY_CATEGORIES.includes(m.category)).map((mod) => {
              const Icon = ICONS[mod.icon] ?? LayoutDashboard;
              const active = pathname === mod.href || pathname.startsWith(mod.href + "/");
              return <Link key={mod.id} href={mod.href} onClick={handleNav} className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition", active ? "bg-brand-500/15 font-medium text-medathon-nav-active" : "text-medathon-nav-muted hover:bg-white/5 hover:text-slate-200")}><Icon className="h-4 w-4 shrink-0" /><span className="truncate">{mod.label}</span></Link>;
            })}
          </div>
        </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
            <p className="text-xs font-medium text-slate-200">Kiosk status</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              <span className="text-[10px] text-slate-400">Reception Kiosk Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
