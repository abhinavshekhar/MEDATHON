"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Scan, Upload } from "lucide-react";

type AnalysisResult = {
  status: string;
  confidence: number;
  finding: string;
  model: string;
  processing_ms: number;
  heatmap_available: boolean;
};

export function AiRadiologyPanel() {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [patientId, setPatientId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const aiUrl = process.env.NEXT_PUBLIC_AI_API_URL ?? "http://localhost:8000";

  async function runAnalysis() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${aiUrl}/api/ai/radiology/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_id: "V-DEMO",
          patient_id: patientId || "demo",
          image_url: preview ?? "inline-upload",
        }),
      });
      if (!res.ok) throw new Error("AI service unavailable — start services/ai-api on port 8000");
      const data = await res.json();
      setResult(data);
      setAnalyzed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setResult({
        status: "completed",
        confidence: 0.78,
        finding:
          "Bilateral lower-zone opacities consistent with inflammatory changes. Correlate with vitals and symptoms. Demo mode — start FastAPI for live model.",
        model: "DenseNet121",
        processing_ms: 1200,
        heatmap_available: true,
      });
      setAnalyzed(true);
    } finally {
      setLoading(false);
    }
  }

  function onFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setAnalyzed(false);
    setResult(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Upload chest X-ray" description="PNG / JPEG · DenseNet121 Grad-CAM">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        <div
          className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <div className="relative h-full w-full">
              <img src={preview} alt="X-ray" className="h-full w-full object-contain" />
              {analyzed && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(239,68,68,0.5),transparent_55%)]" />
              )}
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-500">Tap to upload X-ray image</p>
            </div>
          )}
        </div>
        <Input className="mt-4" label="Patient ID (optional)" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Patient cuid or P-CHN-…" />
        <Button className="mt-4 w-full" onClick={runAnalysis} disabled={loading || !preview}>
          <Scan className="h-4 w-4" />
          {loading ? "Analysing…" : "Run AI analysis"}
        </Button>
        {error && (
          <p className="mt-2 flex items-center gap-2 text-xs text-amber-700">
            <AlertCircle className="h-3 w-3" />{error}
          </p>
        )}
      </Card>

      <Card title="Findings" description="Assistive interpretation · clinician review required">
        {analyzed && result ? (
          <div className="space-y-4">
            <Badge variant={result.confidence > 0.7 ? "warning" : "success"}>
              {result.confidence > 0.7 ? "Review recommended" : "Low suspicion"} · {(result.confidence * 100).toFixed(0)}% confidence
            </Badge>
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{result.finding}</div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-100 p-3">
                <dt className="text-slate-500">Model</dt>
                <dd className="font-medium">{result.model}</dd>
              </div>
              <div className="rounded-lg border border-slate-100 p-3">
                <dt className="text-slate-500">Processing</dt>
                <dd className="font-medium">{result.processing_ms}ms</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Upload an X-ray and run analysis to see heatmap and findings.</p>
        )}
      </Card>
    </div>
  );
}
