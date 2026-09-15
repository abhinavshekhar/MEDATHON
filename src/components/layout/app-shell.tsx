"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { Sidebar } from "./sidebar";
import { HIMS_MODULES } from "@/types/hims";


const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/opd/registration": "Patient Registration",
  "/patients": "Patient Records",
  "/smart-clinic/digital-twin": "Digital Twin",
};

function resolveTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (/^\/patients\/[^/]+$/.test(pathname)) return "Patient Profile";
  return HIMS_MODULES.find((m) => m.href === pathname)?.label ?? "MEDATHON";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const title = resolveTitle(pathname);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/patients?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="flex min-h-screen bg-medathon-surface">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[72px] items-center justify-between border-b border-medathon-border bg-white px-4 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[15px] font-semibold text-slate-900">{title}</p>
              <p className="hidden text-[11px] text-medathon-muted sm:block">Medathon Clinical Network / Active workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearch} className="hidden items-center gap-2 rounded-xl border border-medathon-border bg-slate-50 px-3 py-2 sm:flex">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input aria-label="Search patients"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients"
                className="w-36 bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400 lg:w-44"
              />
            </form>
            <button aria-label="Notifications" className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>
            <span className="hidden rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700 md:inline">
              Data Entry
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-xs font-bold text-white shadow-sm">
              DE
            </div>
          </div>
        </header>
        <main className="surface-grid flex-1 overflow-y-auto p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
