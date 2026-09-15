# MEDATHON AI & IoT API

FastAPI service for **Project 2: AI-Powered Smart Clinic**.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| POST | `/api/vitals` | Ingest vitals (REST) |
| GET | `/api/vitals/{patient_id}` | Latest vitals for Digital Twin |
| WS | `/ws/vitals` | Live ESP32 vitals stream |
| POST | `/api/ai/radiology/analyze` | X-ray Grad-CAM (stub) |
| POST | `/api/ai/nlp/summarize` | Visit NLP summary (stub) |

## Setup

```bash
cd services/ai-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## ESP32 WebSocket payload

```json
{
  "patient_id": "clxxx",
  "visit_id": "V-001",
  "kiosk_id": "KIOSK-01",
  "bpm": 72,
  "spo2": 98.5,
  "temperature": 36.8
}
```

## Next.js integration

Set in `.env`:
```
NEXT_PUBLIC_AI_API_URL=http://localhost:8000
```

Digital Twin widget should connect to `ws://localhost:8000/ws/vitals` or poll `GET /api/vitals/{patient_id}`.
