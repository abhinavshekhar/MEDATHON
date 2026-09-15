# MEDATHON

**HIMS × AI-Powered Smart Clinic** — Cyber-Physical Healthcare Platform (Chennai, Tamil Nadu)

> Solo 24-hour meathon build by **Abhinav Shekhar** — full-stack hospital software, patient mobile app, kiosk tablet, digital twin, and AI radiology in one monorepo.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://medathon-ten.vercel.app)
[![GitHub](https://img.shields.io/badge/repo-GitHub-181717)](https://github.com/abhinavshekhar/MEDATHON)

---

## Live Demo

| App | URL |
|-----|-----|
| **Desktop HIMS** | https://medathon-ten.vercel.app |
| **Patient mobile app** | https://medathon-ten.vercel.app/patient-app |
| **Kiosk tablet (11″)** | https://medathon-ten.vercel.app/kiosk |
| **Digital Twin** | https://medathon-ten.vercel.app/smart-clinic/digital-twin |
| **AI Radiology** | https://medathon-ten.vercel.app/smart-clinic/radiology |
| **Aadhaar ID PDF** | https://medathon-ten.vercel.app/smart-clinic/id-scanner |

**GitHub:** https://github.com/abhinavshekhar/MEDATHON

---

## Features

Built in 24 hours as a solo participant:

- **Desktop HIMS** — Clinical command center with live stats, OPD queue, 22+ functional modules (no “coming soon”)
- **Patient registration & records** — Full OPD workflow, search, patient profiles
- **Patient mobile web app** — Self-registration, ABDM-style QR health card
- **Kiosk tablet UI** — QR scan → vitals capture → sync to database
- **Digital Twin** — Live vitals monitor for doctors on desktop
- **AI Radiology** — X-ray upload with DenseNet121-style analysis (demo)
- **Aadhaar ID PDF** — Generate demo ID cards with embedded patient QR
- **Datasets** — 2,000 synthetic Chennai patients + 2,000 Aadhaar ID records
- **Android app** — Kotlin Jetpack Compose patient app (`android-app/`)
- **IoT ready** — ESP32 firmware + FastAPI WebSocket API for live vitals

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Web frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Database** | Prisma 5, SQLite (bundled `prisma/dev.db`) |
| **AI (production)** | Next.js API routes (`/api/ai/*`) on Vercel |
| **AI / IoT (optional)** | FastAPI, WebSockets, uvicorn (`services/ai-api/`) |
| **Hardware** | ESP32, MAX30102, MLX90614 (`hardware/iot/`) |
| **Mobile** | Kotlin, Jetpack Compose (`android-app/`) |
| **Deploy** | Vercel (web) + Render (FastAPI, optional) |

---

## Quick Start

```bash
git clone https://github.com/abhinavshekhar/MEDATHON.git
cd MEDATHON
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000

### Optional — load demo data

```bash
npm run data:patients    # 2,000 patients + DB import
npm run data:aadhaar     # 2,000 Aadhaar ID records
npm run data:seed-ops    # Lab, pharmacy, vitals seed
```

### Optional — local FastAPI (WebSocket / ESP32)

```bash
cd services/ai-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Set `NEXT_PUBLIC_AI_API_URL=http://localhost:8000` in `.env` to use external FastAPI locally.

### Optional — Android app

1. Open project root in Android Studio
2. Copy `android-app/.env.example` → `.env` (set `SERVER_URL`)
3. Sync Gradle — module is `android-app/` (not `app/`)

---

## Digital Twin Flow

```
Patient mobile app  →  register + ABDM QR
        ↓
Kiosk tablet        →  scan QR → capture vitals → POST /api/vitals
        ↓
Shared database     →  Prisma / SQLite (VitalLog, Patient, OPDVisit)
        ↓
Desktop HIMS        →  Digital Twin shows live vitals + AI radiology
```

All apps share one database and one QR payload format (`src/lib/patient-qr.ts`).

---

## Deployment

### Vercel (web — auto-deploy)

Pushes to `master` on GitHub auto-deploy to production.

| Variable | Production value |
|----------|------------------|
| `DATABASE_URL` | `file:./prisma/dev.db` |
| `NEXT_PUBLIC_APP_URL` | `https://medathon-ten.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `MEDATHON` |
| `NEXT_PUBLIC_AI_API_URL` | `https://medathon-ten.vercel.app` |

Sync local env from Vercel:

```bash
npx vercel env pull .env.local
```

### Render (FastAPI — optional, for WebSocket / ESP32)

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New Blueprint**
2. Connect repo `abhinavshekhar/MEDATHON`
3. Render reads `render.yaml` and deploys `services/ai-api`
4. Set `AI_API_URL` on Vercel to your Render URL for vitals forwarding

---

## Project Structure

```
MEDATHON/
├── src/                    # Next.js web app (HIMS + patient-app + kiosk)
│   ├── app/(app)/          # Desktop staff dashboard & modules
│   ├── app/patient-app/    # Patient mobile web PWA
│   ├── app/kiosk/          # Kiosk tablet fullscreen UI
│   └── app/api/            # REST APIs (patients, vitals, AI)
├── android-app/            # Kotlin Jetpack Compose mobile app
├── prisma/                 # Schema + dev.db (2,000 patients)
├── services/ai-api/        # FastAPI — WebSocket vitals + AI
├── hardware/iot/           # ESP32 firmware
├── patient dataset/        # 2,000 patient JSON/CSV
├── aadhaar id dataset/     # 2,000 ID card records
├── scripts/                # Data generators & seeders
├── docs/                   # Blueprints, prompts, data models
└── render.yaml             # One-click FastAPI deploy on Render
```

---

## Datasets

| Folder | Contents |
|--------|----------|
| `patient dataset/` | 2,000 Chennai/TN patients (15–16 Sep 2026) |
| `aadhaar id dataset/` | 2,000 demo Aadhaar ID records with QR payloads |

Regenerate:

```bash
npm run data:patients
npm run data:aadhaar
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js on :3000 |
| `npm run build` | Production build (Prisma + Next.js) |
| `npm run data:patients` | Generate 2,000 patients + import to DB |
| `npm run data:aadhaar` | Generate Aadhaar ID dataset |
| `npm run data:seed-ops` | Seed lab, pharmacy, vitals |

---

## Solo Participant

**Abhinav Shekhar** — 24-hour meathon, full-stack solo build:

- Next.js HIMS + patient app + kiosk + APIs
- 2,000-patient dataset + database
- AI radiology + digital twin
- Android Kotlin app scaffold
- ESP32 / FastAPI IoT path
- Deployed live on Vercel

---

## License

Built for hackathon / academic demo purposes. Not for production clinical use without proper compliance review.
