"""
MEDATHON AI & IoT Telemetry API (Project 2)
FastAPI service for:
  - WebSocket vitals streaming from ESP32 kiosks
  - Radiology AI (DenseNet121 Grad-CAM) — placeholder
  - NLP visit summaries (Ollama) — placeholder
  - ID card OCR proxy — placeholder

Run: uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

_DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://medathon-ten.vercel.app",
    "https://medathon-abhinavshekharofficial-1386s-projects.vercel.app",
]

def _allowed_origins() -> list[str]:
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if raw.strip():
        return [o.strip() for o in raw.split(",") if o.strip()]
    return _DEFAULT_ORIGINS

app = FastAPI(
    title="MEDATHON AI & IoT API",
    description="Telemetry streaming and AI services for Smart Clinic",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# In-memory store for dev; replace with PostgreSQL via Prisma/HTTP in production
_vitals_buffer: list[dict[str, Any]] = []
_ws_clients: set[WebSocket] = set()


class VitalReading(BaseModel):
    patient_id: str
    visit_id: str | None = None
    kiosk_id: str | None = None
    bpm: float | None = Field(None, ge=0, le=300)
    spo2: float | None = Field(None, ge=0, le=100)
    temperature: float | None = Field(None, ge=30, le=45)
    recorded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RadiologyRequest(BaseModel):
    visit_id: str
    patient_id: str
    image_url: str


class NlpSummaryRequest(BaseModel):
    visit_id: str
    patient_id: str
    history_text: str


class IntakeTriageRequest(BaseModel):
    cluster: str = "metabolic"
    red_flags: list[dict[str, Any]] = Field(default_factory=list)
    age_years: float | None = None
    vitals: dict[str, float] | None = None
    duration_hours: float | None = None
    free_text: str | None = None


class IntakeSummarizeRequest(BaseModel):
    complaint: str
    answers: list[dict[str, str]] = Field(default_factory=list)
    free_text: str | None = None
    patient_name: str = "Patient"
    age_years: float | None = None
    vitals: dict[str, float] | None = None


@app.get("/health")
def health():
    return {"status": "ok", "service": "medathon-ai-api"}


@app.post("/api/vitals")
async def ingest_vitals(reading: VitalReading):
    """REST fallback for vitals (ESP32 can POST if WebSocket unavailable)."""
    record = reading.model_dump()
    record["recorded_at"] = reading.recorded_at.isoformat()
    _vitals_buffer.append(record)
    if len(_vitals_buffer) > 1000:
        _vitals_buffer.pop(0)
    await _broadcast({"type": "vitals", "data": record})
    return {"ok": True, "id": len(_vitals_buffer)}


@app.get("/api/vitals/{patient_id}")
def get_patient_vitals(patient_id: str, limit: int = 50):
    """Latest vitals for Digital Twin widget."""
    items = [v for v in _vitals_buffer if v.get("patient_id") == patient_id]
    return {"patient_id": patient_id, "readings": items[-limit:]}


@app.websocket("/ws/vitals")
async def vitals_websocket(websocket: WebSocket):
    """ESP32 kiosks connect here and stream live readings."""
    await websocket.accept()
    _ws_clients.add(websocket)
    try:
        while True:
            raw = await websocket.receive_text()
            payload = json.loads(raw)
            payload.setdefault("recorded_at", datetime.now(timezone.utc).isoformat())
            _vitals_buffer.append(payload)
            await _broadcast({"type": "vitals", "data": payload})
            await websocket.send_json({"ok": True})
    except WebSocketDisconnect:
        _ws_clients.discard(websocket)


@app.post("/api/ai/radiology/analyze")
async def analyze_radiology(req: RadiologyRequest):
    """DenseNet121 Grad-CAM demo — wire PyTorch model for production."""
    import random
    confidence = round(0.62 + random.random() * 0.28, 2)
    return {
        "visit_id": req.visit_id,
        "patient_id": req.patient_id,
        "status": "completed",
        "confidence": confidence,
        "finding": (
            "Patchy opacities in bilateral lower lung zones, more pronounced on the right. "
            "Pattern may represent inflammatory or infectious process. "
            "Recommend clinical correlation with vitals, SpO2, and symptoms. "
            "No pleural effusion detected on this view."
        ),
        "model": "DenseNet121-GradCAM",
        "processing_ms": 1180,
        "heatmap_available": True,
        "heatmap_url": None,
    }


@app.post("/api/ai/nlp/summarize")
async def summarize_history(req: NlpSummaryRequest):
    """Rule-based NLP summary mirroring MediKiosk TS pipeline."""
    from intake_ml import summarize_intake

    result = summarize_intake(
        complaint="Reported via NLP endpoint",
        answers=[],
        free_text=req.history_text,
        patient_name="Patient",
        age_years=None,
        vitals=None,
    )
    return {
        "visit_id": req.visit_id,
        "patient_id": req.patient_id,
        "status": "completed",
        "summary": result["physician_summary"],
        "structured_history": result["structured_history"],
        "triage": result["triage"],
        "red_flags": result["red_flags"],
        "model": result["model"],
    }


@app.post("/api/ai/intake/triage")
async def intake_triage(req: IntakeTriageRequest):
    """sklearn logistic triage scorer mirroring MediKiosk TS logic."""
    from intake_ml import score_triage

    return score_triage(
        cluster=req.cluster,
        red_flags=req.red_flags,
        age_years=req.age_years,
        vitals=req.vitals,
        duration_hours=req.duration_hours,
        free_text=req.free_text,
    )


@app.post("/api/ai/intake/summarize")
async def intake_summarize(req: IntakeSummarizeRequest):
    """Structured history + physician summary from kiosk intake."""
    from intake_ml import summarize_intake

    return summarize_intake(
        complaint=req.complaint,
        answers=req.answers,
        free_text=req.free_text,
        patient_name=req.patient_name,
        age_years=req.age_years,
        vitals=req.vitals,
    )


async def _broadcast(message: dict):
    dead: list[WebSocket] = []
    for ws in _ws_clients:
        try:
            await ws.send_json(message)
        except Exception:
            dead.append(ws)
    for ws in dead:
        _ws_clients.discard(ws)
