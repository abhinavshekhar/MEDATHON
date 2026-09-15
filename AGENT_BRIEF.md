# MEDATHON — Agent Brief

> **Read this first.** Single source of truth for any agent working on this repository.
> **Two integrated projects:** MEDATHON HIMS (web hospital software) + AI-Powered Smart Clinic (IoT kiosk, AI, mobile).

---

## 0. Dual-Project Overview

| | Project 1: MEDATHON HIMS | Project 2: Smart Clinic |
|---|--------------------------|-------------------------|
| **What** | Hospital management web app | IoT vitals kiosk + AI diagnostics |
| **Code** | `src/`, `prisma/`, `docs/DATA_MODELS/` | `services/ai-api/`, `hardware/iot/`, `mobile/`, `addhar detector/` |
| **Stack** | Next.js 14, Prisma, PostgreSQL | FastAPI, ESP32, Kotlin, PyTorch/Ollama |
| **Blueprint** | `docs/DATA_MODELS/` | `docs/PROJECT_BLUEPRINT.md` |

**Vision:** Cyber-Physical System — register patient → kiosk captures vitals → doctor sees Digital Twin + AI X-ray analysis.

---

## 1. Project Purpose

**MEDATHON HIMS** is a modern healthcare platform for clinics and hospitals. It covers:

- Patient registration & records
- OPD (outpatient) visits
- Maternal & child health (MCH)
- Pediatric care
- Accident & emergency (A&E)
- Pharmacy (prescriptions, dispensing, inventory)
- Laboratory (orders, sample tracking, verification, reports)
- Radiology & ECG
- Inventory management
- Staff roster & room management
- MIS (management information / analytics dashboards)
- National digital health ID integration (ABHA/ABDM)

**Goals:** New UI/UX, custom branding, AI-powered features (voice input, smart search, clinical alerts, NL analytics).

**Current state:** Early scaffold — dashboard shell exists; individual module pages are **not yet built**. Data models and DB schema are defined from requirements analysis.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Web | Next.js 14 (App Router), React 18, TypeScript |
| Frontend Mobile | Kotlin, Jetpack Compose (`mobile/`) |
| Primary Backend | Next.js API Routes + Prisma 5 |
| AI/Telemetry API | FastAPI + WebSockets (`services/ai-api/`) |
| Database | PostgreSQL (Supabase planned) |
| Hardware | ESP32, MAX30102, MLX90614 (`hardware/iot/`) |
| AI Engine | PyTorch DenseNet121, Ollama, OpenCV |
| Styling | Tailwind CSS 3 |
| Validation | Zod |

**Not yet implemented:** API routes, auth, Redis, S3, AI service layer.

---

## 3. Repository Structure

```
MEDATHON/
├── AGENT_BRIEF.md              ← YOU ARE HERE
├── README.md
├── docs/
│   ├── PROJECT_BLUEPRINT.md    ← Dual-project MDP blueprint
│   └── DATA_MODELS/
├── src/                        ← Project 1: Next.js HIMS
├── prisma/                     ← Shared DB (HIMS + VitalLog + Consultation)
├── services/ai-api/            ← Project 2: FastAPI telemetry + AI
├── hardware/iot/               ← Project 2: ESP32 firmware
├── mobile/                     ← Project 2: Kotlin staff app
├── addhar detector/            ← Project 2: ID card OCR
└── scripts/                    ← Data model extraction tools
```

---

## 4. Application Modules (Navigation Map)

Defined in `src/types/hims.ts` as `HIMS_MODULES`. Each entry has:
- `id`, `label`, `href` (Next.js route), `icon`, `category`

| Category | Modules | Route |
|----------|---------|-------|
| **OPD** | Patient Registration, Shared Health ID Profiles | `/opd/registration`, `/abha/profiles` |
| **Patient Management** | Patient Records | `/patients` |
| **MCH** | MCH Registration | `/mch/registration` |
| **Pediatric** | Pediatric Registration | `/pediatric/registration` |
| **Accident & Emergency** | A&E Registration, A&E Queue | `/ae/registration`, `/ae/queue` |
| **Pharmacy** | Pharmacy Workspace, Drug Dispense | `/pharmacy`, `/pharmacy/dispense` |
| **Lab** | Lab Workspace, Lab Verification, Lab Reports, Disease Reporting | `/lab`, `/lab/verification`, `/lab/reports`, `/lab/dengue` |
| **Radiology** | Radiology Registration | `/radiology` |
| **ECG** | ECG Workspace | `/ecg` |
| **Inventory** | Inventory | `/inventory` |
| **Administration** | Roster Management | `/admin/roster` |
| **MIS** | MIS Dashboard | `/mis` |

**None of these routes exist yet** except `/` (dashboard). Building them is the main development work.

---

## 5. Core Data Entities

### 5.1 Patient (`docs/DATA_MODELS/patient.json` + `prisma/schema.prisma`)

**Demographics:** firstName, middleName, lastName, age (Y/M/D), dateOfBirth, gender, maritalStatus, fatherSpouseName, communityHealthWorker, bloodGroup, religionCaste, category, isDead

**Address (cascading hierarchy):** country → state → district → block → village → panchayat, plus ward, postOffice, policeStation, pinCode, free-text address

**Communications:** email, mobile

**Identification:** nationalIdNumber (aadhaar), voterId (epic), digitalHealthAddress (abha)

**Insurance / welfare schemes (checkboxes):** pmjay, rbsk, ncdCbca, hbnc, bpl, pmsma, fpot, fp, hbyc, others

**MLC (medico-legal case, conditional):** mlcNo, policeStation, psiConstable, firDate, incidentDateTime, mrdRegNo, caseType, consentTaken, document uploads, specialNotes

### 5.2 OPD Visit (`opd-visit.json`)

visitId, patientId, clinicId, opdType, modalityType, doctorId/Name, roomNo, referredBy, reason, feeAmount, paymentCollected, status (registered → in_queue → with_doctor → completed | cancelled), isMLC

### 5.3 Pharmacy (`pharmacy.json`)

- **PharmacyQueue:** pending prescriptions
- **DrugDispense:** patient, visit, prescription, medicine line items (batch, expiry, qty, dosage, frequency)
- **PharmacyManagement:** stock, catalog, suppliers

### 5.4 Lab (`lab.json`)

- **PathologyRegistration:** patient + tests ordered
- **LabQueue:** samples awaiting processing
- **LabVerification:** results pending approval
- **LabReport:** dispatch to patient/doctor
- **LabTest:** testName, testCode, result, normalRange, unit, status pipeline

### 5.5 Other entity schemas

- `mch.json` — MCH registration (extends Patient + OPD + payment + photo)
- `ae.json` — A&E (extends Patient + ward/bed + MLC types)
- `abdm.json` — Digital health ID linking (OTP auth, shared profiles)

---

## 6. Page-Level Specs (`docs/DATA_MODELS/pages/`)

Auto-generated from extraction. Each JSON file contains:

```json
{
  "title": "Screen name",
  "headings": ["Section titles on screen"],
  "searchFields": [...],
  "formFields": [{ "id", "label", "type", "required", "options" }],
  "tables": [{ "id", "headers": ["Column names"] }],
  "fieldCount": 55,
  "tableCount": 9
}
```

| File | Fields | Tables | Purpose |
|------|--------|--------|---------|
| `patient-records.json` | 1 | 1 | Search + list patients |
| `mch-registration.json` | 55 | 9 | MCH patient registration form |
| `pharmacy-workspace.json` | 4 | 1 | Pharmacy queue by date |
| `lab-workspace.json` | 33 | 5 | Lab sample queue + collection |
| `mis-dashboard.json` | 0 | 0 | AJAX-loaded widgets (OPD, Lab, Pharmacy, Nursing) |
| `ae-registration.json` | 53 | 8 | Emergency admission + MLC |
| `drug-dispense.json` | 41 | 6 | Prescription dispensing + billing |
| `pathology-registration.json` | 59 | 9 | Lab test registration |
| `abdm-profile.json` | 9 | 3 | Health ID profile sharing |
| `roster-management.json` | 3 | 1 | Doctor shift roster |

**Regenerate:** `python scripts/generate_data_models.py`

---

## 7. Database Schema (`prisma/schema.prisma`)

PostgreSQL via Prisma. Key models:

| Model | Purpose |
|-------|---------|
| `User` | Staff accounts (roles: DATA_ENTRY, DOCTOR, LAB_TECH, PHARMACIST, ADMIN, MIS_VIEWER) |
| `Clinic` | Health facility (name, registry ID, district, block) |
| `Patient` | Full patient record with address, schemes |
| `OPDVisit` | Outpatient visit linked to patient + clinic |
| `MLCDetails` | Medico-legal case (1:1 with visit) |
| `Prescription` + `PrescriptionItem` | Pharmacy orders |
| `LabOrder` + `LabTestResult` | Lab workflow |

**Setup:**
```bash
cp .env.example .env   # set DATABASE_URL
npx prisma generate
npx prisma db push
```

---

## 8. TypeScript Types (`src/types/hims.ts`)

Exports:
- `Patient`, `PatientAddress`, `GovernmentSchemes`, `OPDVisit`, `MLCDetails`
- `NavModule`, `ModuleCategory`
- `HIMS_MODULES` — array driving dashboard navigation

Use these types when building forms and API handlers. Align field names with Prisma schema where possible.

---

## 9. Frontend (Current Implementation)

### `src/app/page.tsx` — Dashboard only

- Header with app name + user role badge
- 4 stat cards (placeholder values: "—")
- Module grid grouped by category (links to unbuilt routes)
- AI features banner

### `src/app/layout.tsx`

- Sets page title: "MEDATHON HIMS"
- Loads `globals.css`

### Styling

- Tailwind with custom `brand` color palette (sky blue: 50–900)
- Cards: rounded-xl, border slate-200, hover brand-300

---

## 10. AI Features Roadmap (`docs/AI_FEATURES_ROADMAP.md`)

| Phase | Features |
|-------|----------|
| **1 — Smart Registration** | Fuzzy patient search, voice-to-form, ID card OCR auto-fill, scheme eligibility suggestions |
| **2 — Clinical Intelligence** | Symptom triage, drug interaction alerts, lab result interpreter, outbreak prediction |
| **3 — Operations** | Natural language MIS queries, predictive stock, roster optimizer, anomaly detection |
| **4 — Engagement** | WhatsApp/SMS bot, multilingual UI, patient portal |

Planned architecture: Next.js → API Gateway → microservices (Patient, OPD/Lab/Pharmacy, AI) → PostgreSQL + Redis + S3.

---

## 11. Aadhaar / ID Card Reader (`addhar detector/aadhaar_reader.py`)

Standalone Python tool (not integrated into Next.js yet):

- **QR scan** via webcam (old XML format + secure binary format)
- **OCR fallback** (press `o`) using Tesseract
- Extracts: name, DOB, gender, address (masks full ID number by default)
- **Privacy:** Only last 4 digits shown; consent required for real use

**Deps:** `opencv-python`, `pyzbar`, `pytesseract`, system `tesseract-ocr`, `zbar`

**Future integration:** Wire into Patient Registration for auto-fill (Phase 1 AI).

---

## 12. Scripts Reference

| Script | Purpose |
|--------|---------|
| `extract_hims_pages.py` | Logs into reference system, scrapes 10 module pages, outputs JSON |
| `generate_data_models.py` | Converts raw extraction → `docs/DATA_MODELS/pages/*.json` |
| `summarize_extraction.py` | Human-readable summary of extraction |
| `debug_login.py` / `debug_facility.py` | Auth debugging for scraper |

These are **optional tooling** for refreshing field specs. The app does not depend on them at runtime.

---

## 13. Recommended API Design (`docs/API_ENDPOINTS.md`)

Target REST shape for new backend (not implemented):

```
GET    /api/v1/patients/search?q=
POST   /api/v1/patients
GET    /api/v1/patients/:id
PUT    /api/v1/patients/:id
POST   /api/v1/opd/registrations
GET    /api/v1/clinics
GET    /api/v1/services
POST   /api/v1/health-id/link
GET    /api/v1/health-id/search
```

Legacy reference system used monolithic `ajaxEhr.php?sFlag=...` — **do not replicate this pattern**.

---

## 14. Cross-Cutting UI Patterns

Observed across all modules (use when building screens):

1. **Registration pages** share one patient form (~40 fields) + module-specific section (OPD details, test details, A&E ward, etc.)
2. **Queue pages** share: date picker, patient search, filter checkboxes, data table with actions
3. **Health ID linking** appears on registration + lab + profile screens (OTP + demographics auth)
4. **Duplicate detection** modal on registration (search before create)
5. **Today's queue** sidebar/table on registration pages
6. **Doctor roster** widget on registration pages

---

## 15. User Roles

| Role | Typical Access |
|------|----------------|
| DATA_ENTRY | Registration, patient records |
| DOCTOR | OPD, prescriptions, recommendations |
| LAB_TECH | Lab queue, sample collection, verification |
| PHARMACIST | Pharmacy workspace, drug dispense |
| ADMIN | Roster, room management, inventory |
| MIS_VIEWER | Analytics dashboard (read-only) |

Role-based menu visibility is planned; not implemented yet.

---

## 16. Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/medathon_hims"
NEXT_PUBLIC_APP_NAME="MEDATHON HIMS"
```

---

## 17. Commands

```bash
npm install          # Install dependencies (116 packages)
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build
npm run start        # Run production server
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to DB
npx prisma studio    # DB GUI
```

---

## 18. What Is NOT Built Yet

- [ ] All module pages (`/opd/registration`, `/pharmacy`, `/lab`, etc.)
- [ ] API routes (`src/app/api/`)
- [ ] Authentication & session management
- [ ] Database seeding / migrations
- [ ] Form components (reusable patient form, address cascade, scheme checkboxes)
- [ ] Queue/table components (DataTable with filters)
- [ ] Health ID (ABDM) integration
- [ ] Aadhaar reader integration into registration
- [ ] AI service layer
- [ ] MIS dashboard widgets
- [ ] File upload (MLC documents, patient photo)
- [ ] Payment/billing flow
- [ ] Branding finalization (logo, colors, app name)

---

## 19. Conventions for Agents

1. **Read page specs** in `docs/DATA_MODELS/pages/` before building a screen.
2. **Match Prisma schema** when creating API handlers.
3. **Use `HIMS_MODULES`** from `src/types/hims.ts` for navigation — keep routes consistent.
4. **Reuse patient form** across registration modules; only the module-specific section differs.
5. **Do not copy legacy UI** — build modern, accessible, mobile-friendly components.
6. **Brand is MEDATHON** — replace any placeholder facility names in code.
7. **Field IDs** in JSON specs (e.g. `idPatientFirstName`) map to form `name`/`id` attributes — useful for migration scripts.
8. **Minimize scope** — one module at a time; don't over-engineer.

---

## 20. Suggested Build Order

1. Reusable UI components (form inputs, tables, layout shell)
2. Patient Registration (`/opd/registration`) — core patient form + OPD details
3. Patient Records (`/patients`) — search + list
4. API routes + Prisma CRUD for Patient + OPDVisit
5. Pharmacy queue + dispense
6. Lab queue + verification
7. Auth + role-based nav
8. MIS dashboard
9. AI features (voice, OCR, smart search)

---

*Last updated: 2026-09-06. This document supersedes scattered references in other docs for agent onboarding.*
