"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ScanLine, Upload, UserPlus } from "lucide-react";

type OcrFields = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  aadhaarMasked?: string;
  district?: string;
  state?: string;
  pinCode?: string;
};

export function IdScannerPanel() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<OcrFields | null>(null);
  const [model, setModel] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function analyzeImage(dataUrl: string) {
    setLoading(true);
    setFields(null);
    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "id_card", image_data_url: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Vision failed");
      setFields(data as OcrFields);
      setModel(String(data.model ?? "Gemini Vision"));
    } catch {
      setFields({
        fullName: "Priya Subramanian",
        dateOfBirth: "1994-08-12",
        gender: "Female",
        address: "Ward 42, T Nagar, Chennai, Tamil Nadu — 600017",
        aadhaarMasked: "XXXX XXXX 4821",
      });
      setModel("demo-fallback");
    } finally {
      setLoading(false);
    }
  }

  function onFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      void analyzeImage(url);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card title="Capture ID" description="Upload or photograph ID card · Gemini Vision OCR">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        <div
          className="relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-950"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="ID card" className="h-full w-full object-contain" />
          ) : (
            <>
              <div className="absolute inset-6 rounded-xl border-2 border-brand-400/60" />
              <Camera className="h-10 w-10 text-slate-500" />
              <p className="absolute bottom-4 text-xs text-slate-400">Tap to upload or capture</p>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => fileRef.current?.click()} disabled={loading}>
            <Upload className="h-4 w-4" />
            {loading ? "Analysing…" : "Scan with ML"}
          </Button>
          <Button variant="secondary" onClick={() => { setPreview(null); setFields(null); }}>Reset</Button>
        </div>
      </Card>

      <Card title="Extracted fields" description="AI OCR output ready for registration">
        {fields ? (
          <div className="space-y-4">
            <Badge variant={model.includes("demo") ? "warning" : "success"}>
              {model.includes("demo") ? "Demo OCR" : "Gemini Vision OCR"}
            </Badge>
            <dl className="space-y-3 text-sm">
              {Object.entries(fields).map(([key, value]) =>
                value ? (
                  <div key={key} className="flex justify-between gap-4 border-b border-slate-50 pb-2">
                    <dt className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="text-right font-medium text-slate-900">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
            <Link href="/opd/registration">
              <Button className="w-full">
                <UserPlus className="h-4 w-4" />
                Use for registration
              </Button>
            </Link>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Upload an ID image to run Gemini Vision OCR.</p>
        )}
      </Card>
    </div>
  );
}
