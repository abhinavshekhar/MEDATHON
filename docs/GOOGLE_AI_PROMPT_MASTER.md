# MEDATHON — Google AI Studio Master Prompt (Digital Twin System)

> **Paste this FIRST** in Google AI Studio before building any app.  
> Then paste the app-specific prompt (Mobile or Kiosk) in the same chat.

---

## PROMPT (copy from here)

You are building apps for **MEDATHON** — a **Digital Twin Cyber-Physical Healthcare System** for **Chennai, Tamil Nadu, India**.

### CRITICAL RULE: USE THE SAME PROJECT FOLDER

**Do NOT create a new repository or separate project.**

All three apps live in **one monorepo** on the user's machine:

```
MEDATHON/                          ← ROOT — work ONLY inside this folder
├── src/                           ← Desktop HIMS (Next.js 14) — ALREADY BUILT
│   ├── app/
│   │   ├── (app)/                 ← Staff desktop UI (dashboard, OPD, lab…)
│   │   ├── patient-app/           ← Patient mobile web app (enhance this)
│   │   ├── kiosk/                 ← Kiosk tablet fullscreen (enhance this)
│   │   └── api/                   ← Shared REST APIs (DO NOT duplicate)
│   ├── lib/
│   │   ├── patient-qr.ts          ← SHARED QR format — import, do not rewrite
│   │   ├── vitals-engine.ts       ← SHARED vitals formula — import, do not rewrite
│   │   ├── aadhaar-id.ts
│   │   └── aadhaar-pdf.ts
│   └── components/
├── mobile/                        ← Native mobile app (Kotlin/React Native) — BUILD HERE
├── prisma/schema.prisma           ← SINGLE database schema for all apps
├── patient dataset/               ← 2000 Chennai patients (JSON)
├── aadhaar id dataset/            ← 2000 ID cards with QR (JSON)
├── services/ai-api/               ← FastAPI — radiology + vitals WebSocket
├── hardware/iot/                  ← ESP32 firmware
├── scripts/                       ← Data generators
└── docs/                          ← Prompts & blueprints
```

**When generating code:**
1. Read existing files in `MEDATHON/` before writing new code
2. Reuse `src/lib/patient-qr.ts` and `src/lib/vitals-engine.ts` — same logic everywhere
3. Call existing APIs in `src/app/api/` — never create parallel backends
4. Use `prisma/schema.prisma` as the single source of truth for data models
5. If building native mobile, put code in `mobile/` but point API to same `localhost:3000`

---

### Digital Twinning Architecture (ALL APPS CONNECTED)

Every app is a **digital twin node**. Data flows in real time through one shared database:

```
┌─────────────────┐     QR scan      ┌─────────────────┐
│  PATIENT MOBILE │ ───────────────► │  KIOSK TABLET   │
│  /patient-app   │     ABDM QR      │  /kiosk           │
│  mobile/        │                  │                   │
└────────┬────────┘                  └────────┬──────────┘
         │ register/login                     │ capture vitals
         │ show ABDM card                     │ POST /api/vitals
         ▼                                    ▼
┌────────────────────────────────────────────────────────────┐
│              SHARED DATABASE (Prisma / SQLite)              │
│   Patient · OPDVisit · VitalLog · LabOrder · Prescription  │
└────────────────────────────┬───────────────────────────────┘
                             │ poll / sync
                             ▼
┌────────────────────────────────────────────────────────────┐
│              DESKTOP HIMS — Digital Twin Workspace          │
│   /smart-clinic/digital-twin  ·  Dashboard  ·  AI Radiology │
└────────────────────────────────────────────────────────────┘
                             ▲
                             │ WebSocket (optional)
┌────────────────────────────┴───────────────────────────────┐
│              FastAPI  services/ai-api/  :8000               │
│   Vitals stream · AI radiology · NLP summaries              │
└────────────────────────────────────────────────────────────┘
```

**Digital twinning rules (mandatory for every app):**

| Event | Source app | Sync target | API |
|-------|-----------|-------------|-----|
| Patient registers | Mobile / Desktop | All apps | `POST /api/patients` |
| ABDM QR generated | Mobile / ID PDF | Kiosk reads it | `src/lib/patient-qr.ts` |
| Vitals captured | Kiosk / ESP32 | Desktop Digital Twin + Mobile | `POST /api/vitals` |
| Vitals displayed | Desktop / Mobile | Reads same VitalLog table | `GET /api/vitals?patientId=` |
| Patient lookup | Kiosk / Scanner | Full history | `GET /api/patients/lookup/{patientNo}` |
| Lab / Rx updated | Desktop | Mobile records tab | `GET /api/patients/{id}` |
| AI radiology | Desktop | Linked to visit | `POST :8000/api/ai/radiology/analyze` |

**Every screen that shows vitals must read from the same `VitalLog` table — never local-only fake data.**

---

### Shared QR payload (all apps must use identical format)

File: `src/lib/patient-qr.ts`

```json
{
  "type": "medathon-patient",
  "patientNo": "P-CHN-20260915-0001",
  "patientId": "<prisma cuid>",
  "name": "Priya Subramanian",
  "abha": "priya.subramanian@abdm"
}
```

### Shared vitals formula (all apps must use identical logic)

File: `src/lib/vitals-engine.ts`

```typescript
function vitalsForPatient(ageYears: number, gender: string) {
  const baseBpm = gender === "FEMALE" ? 72 : 68;
  const bpm = Math.round(baseBpm + (ageYears % 25) + (ageYears > 60 ? 8 : 0));
  const spo2 = Math.min(99, 95 + (ageYears % 5));
  const temperature = Math.round((36.4 + (ageYears % 8) * 0.05) * 10) / 10;
  return { bpm, spo2, temperature };
}
```

---

### Three apps summary

| # | App | Folder to edit | URL | User |
|---|-----|----------------|-----|------|
| 1 | Desktop HIMS | `src/app/(app)/` | `:3000` | Doctors, staff |
| 2 | Patient mobile | `src/app/patient-app/` + `mobile/` | `:3000/patient-app` | Patients |
| 3 | Kiosk tablet | `src/app/kiosk/` | `:3000/kiosk` | Patients at reception |

All three = **digital twins** of the same patient. Change in one → visible in all within seconds.

---

### Datasets (already in repo — use these, do not invent data)

| Folder | Records | Region |
|--------|---------|--------|
| `patient dataset/patients.json` | 2,000 patients | Chennai & Tamil Nadu |
| `aadhaar id dataset/records.json` | 2,000 ID cards | Chennai & Tamil Nadu |

Sample patient ID: `P-CHN-20260915-0001`  
Gender: Male or Female only. No transgender data.

---

### Clinic info

- **Name:** MEDATHON Urban Health Centre — Chennai
- **District:** Chennai, Tamil Nadu, India
- **HFR ID:** HFR-TN-CHN-001

---

### What to read before coding

| File | Why |
|------|-----|
| `README.md` | Current URLs and commands |
| `prisma/schema.prisma` | All data models |
| `src/lib/patient-qr.ts` | QR format |
| `src/lib/vitals-engine.ts` | Vitals logic |
| `src/app/api/vitals/route.ts` | Vitals sync API |
| `src/app/api/patients/lookup/[patientNo]/route.ts` | Patient lookup |
| `src/app/kiosk/page.tsx` | Existing kiosk reference |
| `src/app/patient-app/page.tsx` | Existing mobile reference |
| `src/app/(app)/smart-clinic/digital-twin/page.tsx` | Desktop twin monitor |

---

### Commands (same folder, same terminal)

```bash
cd MEDATHON
npm install
npm run dev                    # Desktop + patient-app + kiosk on :3000
npm run data:patients          # Regenerate 2000 patients
npm run data:aadhaar           # Regenerate ID dataset

cd services/ai-api
uvicorn main:app --port 8000   # AI + vitals WebSocket
```

---

### Do NOT

- Create a new git repo or separate Next.js project
- Duplicate API routes outside `src/app/api/`
- Use different QR JSON format across apps
- Use random vitals — always derive from `vitals-engine.ts`
- Use Bihar/North India data — Chennai/Tamil Nadu only
- Add "Coming soon" screens
- Reference Trane Technologies

---

After reading this, I will give you the **app-specific prompt** (Mobile or Kiosk). Confirm you understand the shared `MEDATHON/` folder and digital twin sync architecture, then build inside the correct subfolder.

## END OF MASTER PROMPT
