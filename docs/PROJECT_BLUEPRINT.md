# MEDATHON HIMS × AI-Powered Smart Clinic

> **Comprehensive Project Blueprint (10-Month MDP)**
> Integrated architecture: hospital management software + Cyber-Physical IoT vitals kiosk + localized AI diagnostics.

---

## 1. Project Vision

We are merging two projects into one **Cyber-Physical System (CPS)**:

| Project | Description |
|---------|-------------|
| **MEDATHON HIMS** | Full hospital/clinic management — registration, OPD, pharmacy, lab, MIS |
| **AI-Powered Smart Clinic** | ESP32 vitals kiosk, live telemetry, AI radiology, NLP summaries, mobile staff app |

**End-to-end flow:** Patient registers via web/mobile → vitals scanned at IoT kiosk in waiting room → doctor views live Digital Twin + AI-analyzed X-rays in workspace.

---

## 2. Unified Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Web** | Next.js 14, Tailwind CSS | HIMS dashboards, MIS, doctor workspace, Digital Twin widget |
| **Frontend Mobile** | Kotlin, Jetpack Compose | Clinic staff app — queue management, e-prescriptions |
| **Primary Backend** | Next.js API Routes + Prisma 5 | CRUD: patients, lab, pharmacy, visits |
| **AI/Telemetry API** | FastAPI (Python) + WebSockets | Live IoT streaming, radiology AI, OCR, NLP |
| **Database** | PostgreSQL (Supabase) | Unified storage with Row Level Security |
| **Hardware (IoT)** | ESP32, MAX30102, MLX90614, C++ | Smart Vitals Kiosk at clinic reception |
| **AI Engine** | PyTorch, Ollama (Llama 3), OpenCV | Radiology heatmaps, NLP summaries, ID OCR |

---

## 3. Integrated Core Modules

### Phase 1 — Smart Registration & Reception
- Standard HIMS registration (OPD, MCH, Pediatric, A&E)
- **IoT:** After registration, patient uses **Smart Vitals Kiosk** — ESP32 streams BPM, SpO2, temperature via FastAPI WebSockets into DB
- **AI:** Webcam ID card reader (OCR) auto-fills demographics (`addhar detector/aadhaar_reader.py`)

### Phase 2 — Doctor Workspace & Digital Twin
- Patient history, prescriptions, lab orders
- **IoT:** Live Digital Twin widget (Recharts) — real-time vitals while patient waits
- **AI:** DICOM/X-ray upload → DenseNet121 Grad-CAM heatmap; Ollama summarizes visit history

### Phase 3 — Pharmacy, Lab & MIS
- Pharmacy queue, lab verification, disease reporting
- MIS: patient flow, AI triage stats, dispensing rates

---

## 4. Team Allocation (MDP)

| Member | Role | Responsibilities |
|--------|------|------------------|
| **Abhinav Shekhar** | Lead / Frontend | Next.js HIMS UI, Tailwind, Kotlin mobile, Recharts |
| **D.K. Harshith** | IoT Engineer | ESP32, WebSocket client, I2C sensors |
| **Bhumikha Bayari** | Embedded Systems | C++ edge filtering, 3D kiosk, custom PCB |
| **Aarya P. Verma** | AI Engineer | DenseNet121 API, Ollama NLP, ID OCR |
| **Gopalakrishnan** | Backend & Cloud | Prisma, Next.js API, Supabase Auth, FastAPI multiplexing |

---

## 5. Repository Layout (Both Projects)

```
MEDATHON/
├── src/                    # Project 1: Next.js HIMS web app
├── prisma/                 # Shared database schema
├── services/ai-api/        # Project 2: FastAPI AI + IoT telemetry
├── hardware/iot/           # Project 2: ESP32 firmware (C++)
├── mobile/                 # Project 2: Kotlin staff app
├── addhar detector/        # Project 2: ID card OCR (Python)
└── docs/                   # Blueprints, data models, roadmaps
```

---

## 6. Data Flow

```
[Patient] → [Next.js Registration] → [PostgreSQL]
                ↓
         [ESP32 Kiosk] ──WebSocket──→ [FastAPI] ──→ [VitalLog table]
                ↓
         [Doctor Dashboard] ← reads vitals + AI radiology + NLP summary
                ↓
         [Kotlin Mobile App] ← queue updates, e-prescriptions
```

---

## 7. Extended Schema Highlights

See `prisma/schema.prisma` for full definitions:

- **VitalLog** — BPM, SpO2, temperature from MAX30102 / MLX90614
- **Consultation** — AI summary, radiology URL, Grad-CAM heatmap URL
- **KioskDevice** — ESP32 device registry per clinic

---

*Source: MDP integrated blueprint. See also `AGENT_BRIEF.md` for implementation status.*
