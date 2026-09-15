"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ScanLine, UserPlus } from "lucide-react";

const SAMPLE = {
  firstName: "Priya",
  lastName: "Sharma",
  gender: "Female",
  dateOfBirth: "1994-08-12",
  address: "Ward 42, T Nagar, Zone 9 — Teynampet, Chennai, Tamil Nadu — 600017",
  aadhaarMasked: "XXXX-XXXX-4821",
};

export function IdScannerPanel() {
  const [scanned, setScanned] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card title="Capture ID" description="Position the card within the frame and scan">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-950">
          <div className="absolute inset-6 rounded-xl border-2 border-brand-400/60" />
          <Camera className="h-10 w-10 text-slate-500" />
          <p className="absolute bottom-4 text-xs text-slate-400">Webcam / scanner input</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setScanned(true)}>
            <ScanLine className="h-4 w-4" />
            Scan card
          </Button>
          <Button variant="secondary" onClick={() => setScanned(false)}>Reset</Button>
        </div>
      </Card>

      <Card title="Extracted fields" description="OCR output ready for registration">
        {scanned ? (
          <div className="space-y-4">
            <Badge variant="success">Scan complete</Badge>
            <dl className="space-y-3 text-sm">
              {Object.entries(SAMPLE).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-slate-50 pb-2">
                  <dt className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="font-medium text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/opd/registration">
              <Button className="w-full">
                <UserPlus className="h-4 w-4" />
                Use for registration
              </Button>
            </Link>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Run a scan to populate patient demographics automatically.</p>
        )}
      </Card>
    </div>
  );
}
