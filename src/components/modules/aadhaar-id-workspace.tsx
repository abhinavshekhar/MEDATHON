"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import type { AadhaarIdRecord } from "@/lib/aadhaar-id";
import { downloadAadhaarIdPdf } from "@/lib/aadhaar-pdf";
import { Camera, Download, FilePlus, ScanLine, Search, UserPlus } from "lucide-react";

function IdCardPreview({ record }: { record: AadhaarIdRecord }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white">
        Government of India · Sample Demo ID
      </div>
      <div className="flex gap-4 p-4">
        <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-2xl font-bold text-slate-500">
          {record.fullName.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1 text-xs">
          <p className="truncate text-sm font-bold text-slate-900">{record.fullName}</p>
          <p className="mt-1 text-slate-600">DOB: {record.dateOfBirth}</p>
          <p className="text-slate-600">Gender: {record.gender}</p>
          <p className="mt-1 line-clamp-2 text-slate-500">{record.address}</p>
        </div>
      </div>
      <div className="border-t border-amber-200 bg-white/60 px-4 py-3 text-center">
        <p className="font-mono text-lg font-bold tracking-widest text-slate-800">{record.aadhaarMasked}</p>
        <p className="mt-1 text-[10px] text-slate-500">{record.id}</p>
      </div>
    </div>
  );
}

export function AadhaarIdWorkspace() {
  const [records, setRecords] = useState<AadhaarIdRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<AadhaarIdRecord | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [ocrFields, setOcrFields] = useState<Partial<AadhaarIdRecord> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "Female",
    address: "",
    district: "Chennai",
    state: "Tamil Nadu",
    pinCode: "",
    mobile: "",
  });

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/aadhaar-id?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setRecords(data.records ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [query]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/aadhaar-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setCreating(false);
    if (res.ok) {
      setPreview(data.record);
      setForm({ fullName: "", dateOfBirth: "", gender: "Female", address: "", district: "Chennai", state: "Tamil Nadu", pinCode: "", mobile: "" });
      load();
    }
  }

  function useForScan(record: AadhaarIdRecord) {
    setPreview(record);
    setScanned(true);
    setOcrFields(null);
  }

  async function runAiScan(dataUrl: string) {
    setScanLoading(true);
    setOcrFields(null);
    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "id_card", image_data_url: dataUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setOcrFields({
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          aadhaarMasked: data.aadhaarMasked,
          district: data.district,
          state: data.state,
          pinCode: data.pinCode,
        });
        setScanned(true);
      }
    } finally {
      setScanLoading(false);
    }
  }

  function onScanFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => void runAiScan(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-slide-up">
      <PageHeader
        title="Aadhaar ID PDF Workspace"
        description="Browse the demo ID dataset, create new sample cards, and download PDFs for OCR testing"
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Create new ID card" description="Generate a sample Aadhaar-format PDF (demo only)">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Priya Subramanian" />
              <Input label="Date of birth" required type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} options={[{ value: "Female", label: "Female" }, { value: "Male", label: "Male" }]} />
              <Input label="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="98XXXXXXXX" />
              <Input label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              <Input label="PIN code" required maxLength={6} value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} placeholder="600017" />
            </div>
            <Input label="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Ward 42, T Nagar, Chennai, Tamil Nadu" />
            <Button type="submit" disabled={creating}>
              <FilePlus className="h-4 w-4" />
              {creating ? "Creating…" : "Create ID & preview"}
            </Button>
          </form>
          {preview && (
            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
              <Badge variant="success">ID created — {preview.id}</Badge>
              <IdCardPreview record={preview} />
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void downloadAadhaarIdPdf(preview)}>
                  <Download className="h-4 w-4" />Download PDF
                </Button>
                <Link href="/opd/registration">
                  <Button variant="secondary"><UserPlus className="h-4 w-4" />Use in registration</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        <Card title="ID scanner" description="Gemini Vision ML OCR from camera or upload">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onScanFile(e.target.files?.[0] ?? null)} />
          <div
            className="relative mb-4 flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-950"
            onClick={() => fileRef.current?.click()}
          >
            <div className="absolute inset-6 rounded-xl border-2 border-brand-400/60" />
            <Camera className="h-10 w-10 text-slate-500" />
            <p className="absolute bottom-4 text-xs text-slate-400">Tap to upload ID image for ML OCR</p>
          </div>
          {scanLoading && <p className="text-sm text-brand-700">Running Gemini Vision analysis…</p>}
          {scanned && (ocrFields || preview) ? (
            <div className="space-y-3 text-sm">
              <Badge variant="success">{ocrFields ? "ML OCR complete" : "Dataset scan"}</Badge>
              <dl className="space-y-2">
                <div className="flex justify-between"><dt className="text-slate-500">Name</dt><dd className="font-medium">{ocrFields?.fullName ?? preview?.fullName}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">DOB</dt><dd>{ocrFields?.dateOfBirth ?? preview?.dateOfBirth}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Aadhaar</dt><dd className="font-mono">{ocrFields?.aadhaarMasked ?? preview?.aadhaarMasked}</dd></div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Upload an ID photo or select a dataset record below.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button className="flex-1" variant="secondary" onClick={() => fileRef.current?.click()} disabled={scanLoading}>
              <ScanLine className="h-4 w-4" />AI scan image
            </Button>
            {preview && (
              <Button variant="ghost" onClick={() => setScanned(true)}>Use selected record</Button>
            )}
          </div>
        </Card>
      </div>

      <Card title="Aadhaar ID PDF dataset" description={`${records.length} sample records · Chennai & Tamil Nadu`}>
        <div className="mb-4 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search name, ID, district…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading dataset…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Aadhaar</th>
                  <th className="pb-3 pr-4">District</th>
                  <th className="pb-3 pr-4">Source</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 50).map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-brand-50/30">
                    <td className="py-3 pr-4 font-mono text-xs">{r.id}</td>
                    <td className="py-3 pr-4 font-medium">{r.fullName}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{r.aadhaarMasked}</td>
                    <td className="py-3 pr-4">{r.district}</td>
                    <td className="py-3 pr-4"><Badge variant={r.source === "custom" ? "violet" : "info"}>{r.source}</Badge></td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { setPreview(r); setScanned(false); }}>Preview</Button>
                        <Button size="sm" variant="secondary" onClick={() => void downloadAadhaarIdPdf(r)}><Download className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => useForScan(r)}><ScanLine className="h-3 w-3" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-amber-700">Demo IDs only — masked numbers, not real Aadhaar. For training and OCR testing.</p>
      </Card>
    </div>
  );
}
