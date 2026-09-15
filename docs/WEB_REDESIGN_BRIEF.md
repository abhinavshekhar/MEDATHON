# MEDATHON — Website UI/UX Redesign Brief

> **Purpose:** Give this document to another AI (or designer/developer) to rebuild the MEDATHON web app with a **professional, modern, premium healthcare UI**. The current implementation works functionally but looks **generic, unfinished, and low-quality**. This brief explains what to build, what to keep, and what to fix.

---

## 1. One-Line Summary

**MEDATHON** is a **Hospital Information Management System (HIMS)** combined with an **AI-powered Smart Clinic** — a cyber-physical platform where patients register at a clinic, vitals are captured via an ESP32 IoT kiosk, doctors view a live Digital Twin dashboard, and AI assists with radiology analysis.

**Your job:** Redesign and rebuild the **Next.js web frontend** so it looks like a **production-grade healthcare product** (think: Epic, Cerner, or modern startups like Olive / Commure / Notable Health) — clean, trustworthy, fast, and usable by clinic staff in India.

---

## 2. What Exists Today (Current State)

### Tech stack (keep this)
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Database ORM | Prisma 5 (SQLite locally, PostgreSQL planned) |
| Icons | Lucide React |
| 3D (optional) | Three.js + React Three Fiber (currently used for hero/background) |
| Validation | Zod |
| AI/IoT API | FastAPI on port 8000 (`services/ai-api/`) |

### Live pages (working)
| Route | Status | Description |
|-------|--------|-------------|
| `/` | Live | Dashboard with stats, recent patients, OPD queue |
| `/opd/registration` | Live | 3-step patient + OPD registration form |
| `/patients` | Live | Patient search and list |
| `/patients/[id]` | Live | Individual patient profile |
| `/smart-clinic/digital-twin` | Live | Live vitals from IoT kiosk (needs FastAPI) |
| `/smart-clinic/kiosk` | Partial | Kiosk monitor page |
| All other routes | Stub | Show "Coming Soon" placeholder |

### API routes (working)
- `GET/POST /api/patients` — list/create patients
- `GET /api/patients/[id]` — patient detail
- `GET /api/stats` — dashboard statistics

### Key source files to read
```
src/app/(app)/page.tsx              — Dashboard
src/app/(app)/layout.tsx            — App layout wrapper
src/components/layout/app-shell.tsx — Header + sidebar shell
src/components/layout/sidebar.tsx   — Navigation (22+ modules)
src/types/hims.ts                   — All module routes + TypeScript types
prisma/schema.prisma                — Database models
docs/DATA_MODELS/pages/*.json       — Field specs for every screen (auto-extracted)
```

---

## 3. Why the Current UI Looks Poor (Honest Critique)

Use this as a **do-not-repeat** checklist:

| Problem | Details |
|---------|---------|
| **No real brand identity** | Placeholder "M" circle logo, generic teal palette, no logo file, no design system |
| **Inconsistent visual language** | Teal brand colors mixed with violet/rose/amber stat gradients + blue/purple banner gradient — feels like 3 different themes |
| **Gimmicky 3D effects** | Floating banner animation, tilt cards, ambient 3D background, Three.js hero scene — adds visual noise without adding value for hospital staff |
| **Unprofessional copy** | "Good morning 👋" emoji in a clinical app; hardcoded "Primary Care Clinic", "Data Entry", avatar "AS" |
| **Generic component library feel** | Basic cards, borders, slate colors — looks like a Tailwind tutorial, not a product |
| **Overcrowded sidebar** | 13 categories, 22+ nav items, tiny 10px uppercase labels — overwhelming for daily use |
| **Empty / placeholder feel** | Most modules are "Coming Soon"; dashboard shows zeros; no onboarding, no sample data richness |
| **Weak typography hierarchy** | Only Inter font, similar text sizes everywhere, no clear visual weight |
| **No auth/login screen** | App opens directly to dashboard — no login, no role selection, no clinic switcher |
| **Forms look basic** | Registration form is functional but plain — no section grouping, no address cascade, no scheme checkboxes despite data model supporting them |
| **Mobile experience untested** | Sidebar collapses but overall layout is desktop-first |
| **No dark mode, no accessibility audit** | Missing focus states, ARIA labels in places, no high-contrast option |
| **No loading/error states polish** | Skeleton loaders exist but minimal; error pages not designed |
| **No illustrations or healthcare imagery** | Either 3D gimmicks or empty white space — no professional medical iconography |

---

## 4. Design Direction (What We Want)

### Overall vibe
- **Trustworthy** — healthcare staff must feel confident using it daily
- **Clean & spacious** — generous whitespace, clear hierarchy, not cluttered
- **Modern but not flashy** — avoid gimmicky 3D, parallax, excessive gradients
- **India-aware** — supports Hindi labels (future), government scheme names (PMJAY, BPL, ABHA), rural clinic workflows
- **Fast** — perceived performance matters; skeleton loaders, optimistic UI

### Reference inspirations (style, not copy)
- **Linear** — clean sidebar, subtle borders, excellent typography
- **Vercel Dashboard** — minimal, professional, great spacing
- **Stripe Dashboard** — clear data tables, stat cards without gradient overload
- **Apple Health** — vital signs display (for Digital Twin page)
- **Practo / PharmEasy** (India) — familiar healthcare UX patterns for Indian users

### Suggested color direction
Replace the current teal-heavy palette with something more distinctive:

| Role | Suggestion |
|------|------------|
| Primary | Deep medical blue (`#1E40AF`) or calm teal (`#0D9488`) — pick ONE and commit |
| Surface | Warm off-white (`#FAFBFC`) or cool gray (`#F8FAFC`) |
| Sidebar | Dark navy (`#0F172A`) or clean white with border |
| Success | Emerald (`#10B981`) |
| Warning | Amber (`#F59E0B`) |
| Danger | Rose (`#EF4444`) |
| Text | Slate 900 for headings, Slate 500 for secondary |

**Create a proper design token file** — don't scatter hex values across components.

### Typography
- **Headings:** Consider `Plus Jakarta Sans`, `DM Sans`, or `Outfit` (distinctive but professional)
- **Body:** `Inter` is fine, or `Geist` / `IBM Plex Sans`
- **Monospace (for IDs):** `JetBrains Mono` for patient numbers, visit IDs

### Logo & branding
- App name: **MEDATHON**
- Tagline options: *"Smart Healthcare Platform"* / *"HIMS × AI-Powered Smart Clinic"* / *"Cyber-Physical Healthcare"*
- Need: SVG logo (not a letter "M" in a circle)
- Favicon exists at `public/favicon.svg` — redesign to match

---

## 5. Application Architecture (Pages to Build)

### 5.1 Shell / Layout (rebuild completely)

**Components needed:**
- `AppShell` — sidebar + top bar + main content area
- `Sidebar` — collapsible, role-aware, grouped navigation
- `TopBar` — search, notifications, user menu, clinic name, breadcrumbs
- `PageHeader` — title, description, primary action button
- `Breadcrumbs` — navigation context

**Sidebar navigation groups** (from `src/types/hims.ts`):

| Category | Modules |
|----------|---------|
| **OPD** | Patient Registration, Shared Health ID Profiles |
| **Patient Management** | Patient Records |
| **MCH** | MCH Registration |
| **Pediatric** | Pediatric Registration |
| **Accident & Emergency** | A&E Registration, A&E Queue |
| **Pharmacy** | Pharmacy Workspace, Drug Dispense |
| **Lab** | Lab Workspace, Lab Verification, Lab Reports, Disease Reporting |
| **Radiology** | Radiology Registration |
| **ECG** | ECG Workspace |
| **Inventory** | Inventory |
| **Administration** | Roster Management |
| **MIS** | MIS Dashboard |
| **Smart Clinic** | Vitals Kiosk Monitor, Digital Twin, AI Radiology, ID Card Scanner |

**Recommendation:** Collapse sidebar to **icon-only mode** on desktop. Show only 5–6 top-level groups; expand on hover/click. Move rarely-used modules under "More".

---

### 5.2 Dashboard (`/`)

**Current:** Greeting, 4 stat cards, recent patients, OPD queue, quick actions, gradient banner.

**Rebuild with:**
- **Role-based dashboard** — different widgets for Data Entry vs Doctor vs Lab Tech
- **Stat cards** — clean, single-color accent (no rainbow gradients), with trend arrows (↑ 12% vs yesterday)
- **Live activity feed** — recent registrations, lab results, kiosk vitals
- **OPD queue widget** — real-time table with status badges (Waiting → With Doctor → Done)
- **Kiosk status card** — online/offline, last reading
- **Quick actions** — large, tappable buttons: New Patient, Search, Digital Twin
- **Remove:** 3D hero canvas, floating banner, emoji greeting
- **Add:** Optional mini chart (OPD trend last 7 days) using Recharts or similar

---

### 5.3 Patient Registration (`/opd/registration`)

**Current:** 3-step wizard (Patient → Address → OPD Visit), ~15 fields.

**Full spec:** `docs/DATA_MODELS/pages/` — reference legacy system field extraction.

**Rebuild with:**
- **Multi-section single page** OR **improved stepper** with progress bar
- **Sections:**
  1. Demographics (name, age/DOB, gender, marital status, blood group)
  2. Contact (mobile, email)
  3. Address (cascading: State → District → Block → Village — India-specific)
  4. Identification (Aadhaar, EPIC, ABHA address)
  5. Government Schemes (checkboxes: PMJAY, RBSK, BPL, PMSMA, etc.)
  6. OPD Details (type, doctor, room, reason, fee, payment)
  7. MLC section (conditional — only if medico-legal case)
- **Smart features (UI placeholders OK):**
  - "Scan ID Card" button → opens camera/OCR modal
  - Duplicate patient detection modal before save
  - ABHA linking flow (OTP)
- **Today's queue sidebar** — show patients registered today while filling form
- **Validation** — inline errors, required field markers, Zod schema

---

### 5.4 Patient Records (`/patients`)

**Rebuild with:**
- **Search bar** — prominent, with filters (gender, age range, district, scheme)
- **Data table** — sortable columns: Patient No, Name, Age, Gender, Mobile, Last Visit, Status
- **Row actions** — View, Edit, New Visit
- **Empty state** — illustration + "Register first patient" CTA
- **Pagination** — for large datasets

---

### 5.5 Patient Profile (`/patients/[id]`)

**Rebuild with:**
- **Header card** — photo placeholder, name, patient no, ABHA, schemes badges
- **Tabs:** Overview | Visits | Vitals | Lab | Prescriptions | Documents
- **Timeline** — chronological medical events
- **Quick actions** — New OPD Visit, Send to Kiosk, View Digital Twin

---

### 5.6 Digital Twin (`/smart-clinic/digital-twin`)

**Current:** 3 vital metric cards + timeline list.

**Rebuild with:**
- **Patient selector** — pick active patient from today's queue
- **Large vital gauges** — heart rate, SpO2, temperature (like Apple Health / hospital monitors)
- **Live chart** — Recharts line graph updating via WebSocket
- **Connection status** — clear online/offline indicator
- **AI summary panel** — placeholder for Ollama-generated visit summary
- **Radiology panel** — X-ray upload + AI heatmap viewer (placeholder)

---

### 5.7 All Other Modules

For modules not yet built, create **polished placeholder pages** (not the current basic "Coming Soon" card):
- Show module icon, description, expected features list
- "Notify me" or "In development" badge
- Link back to related live modules

**Priority build order after core:**
1. Pharmacy Workspace + Drug Dispense
2. Lab Workspace + Verification
3. MIS Dashboard
4. A&E Registration + Queue
5. MCH / Pediatric Registration
6. Auth + role-based access

---

### 5.8 Auth & Onboarding (NEW — doesn't exist)

**Build:**
- `/login` — username/password or OTP (UI only for now)
- Role badge in header (Data Entry, Doctor, Lab Tech, Pharmacist, Admin, MIS Viewer)
- Clinic selector if user has access to multiple facilities
- First-time setup wizard (optional)

---

## 6. Reusable Component Library (Build These First)

Create a `src/components/ui/` design system:

| Component | Notes |
|-----------|-------|
| `Button` | primary, secondary, ghost, danger; sm/md/lg |
| `Input` | with label, error, helper text |
| `Select` | searchable for long lists (doctors, districts) |
| `Checkbox` / `Radio` | for schemes |
| `Card` | with optional header, footer, actions |
| `Badge` | status colors: success, warning, danger, info |
| `Table` | sortable, filterable, with row selection |
| `Modal` / `Dialog` | for confirmations, duplicate detection |
| `Tabs` | for patient profile sections |
| `Stepper` | for multi-step forms |
| `StatCard` | single accent color, no tilt/3D |
| `EmptyState` | illustration + CTA |
| `Skeleton` | loading placeholders |
| `Toast` | success/error notifications |
| `Avatar` | user/patient photos |
| `Dropdown` | user menu, actions |
| `Breadcrumb` | navigation |
| `SearchInput` | with debounce, keyboard shortcut (Cmd+K) |
| `DatePicker` | for visit dates, DOB |
| `FileUpload` | for MLC documents, patient photo |

**Recommendation:** Use **shadcn/ui** as a base (Radix primitives + Tailwind) — it's the industry standard for Next.js apps and will instantly improve quality.

---

## 7. Data Models (Backend Contract)

The UI must align with these Prisma models (`prisma/schema.prisma`):

### Patient
- Demographics: firstName, middleName, lastName, ageYears/Months/Days, dateOfBirth, gender, maritalStatus, bloodGroup
- Contact: email, mobile
- ID: aadhaarNo, epicNo, abhaAddress, patientNo (auto-generated)
- Address: country, state, district, block, ward, village, panchayat, pinCode, address
- Schemes: schemePMJAY, schemeRBSK, schemeBPL, schemePMSMA, etc. (11 boolean flags)
- Relations: visits, labOrders, prescriptions, vitalLogs

### OPDVisit
- visitId, patientId, clinicId, opdType, doctorName, roomNo, reason, feeAmount, paymentCollected, status, isMLC

### VitalLog (Smart Clinic)
- patientId, kioskId, bpm, spo2, temperature, recordedAt

### Consultation (Smart Clinic)
- visitId, aiSummary, radiologyUrl, aiHeatmapUrl, diagnosis, notes

### Other models
- Prescription, PrescriptionItem, LabOrder, LabTestResult, KioskDevice, MLCDetails, User, Clinic

**Field-level specs for forms:** See `docs/DATA_MODELS/pages/*.json` (10 JSON files with every form field, table column, and section heading extracted from the legacy HIMS system).

---

## 8. User Roles & Permissions

| Role | Access |
|------|--------|
| DATA_ENTRY | Registration, patient records |
| DOCTOR | OPD, prescriptions, Digital Twin, AI radiology |
| LAB_TECH | Lab queue, sample collection, verification |
| PHARMACIST | Pharmacy workspace, drug dispense |
| ADMIN | Roster, inventory, user management |
| MIS_VIEWER | Analytics dashboard (read-only) |

Sidebar should hide modules the current role cannot access.

---

## 9. Smart Clinic Integration (IoT + AI)

### IoT Kiosk flow
```
Patient registers → Goes to kiosk → ESP32 reads BPM/SpO2/Temp
→ WebSocket to FastAPI (port 8000) → Saved to VitalLog
→ Doctor sees live vitals on Digital Twin page
```

### AI features (UI placeholders OK for now)
- ID card OCR auto-fill (Python tool exists in `addhar detector/`)
- AI radiology heatmap (DenseNet121 via FastAPI)
- NLP visit summary (Ollama)
- Voice-to-form (future)

### Environment variables
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_NAME="MEDATHON"
NEXT_PUBLIC_AI_API_URL="http://localhost:8000"
```

---

## 10. Technical Constraints

1. **Keep Next.js 14 App Router** — do not migrate to Pages Router
2. **Keep Prisma** — all data access through `src/lib/prisma.ts`
3. **Keep TypeScript** — strict types from `src/types/hims.ts`
4. **Keep API routes** — extend, don't replace
5. **Tailwind CSS** — primary styling (shadcn/ui compatible)
6. **No external auth provider yet** — build login UI, wire later
7. **Remove or simplify 3D** — delete `src/components/3d/` unless there's a compelling reason (Digital Twin 3D body model could be future)
8. **Mobile responsive** — must work on tablets used in clinics
9. **Performance** — dashboard should load < 2s; use Server Components where possible

---

## 11. File Structure (Target)

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          ← NEW
│   ├── (app)/
│   │   ├── layout.tsx              ← App shell
│   │   ├── page.tsx                ← Dashboard (rebuild)
│   │   ├── opd/registration/       ← Rebuild form
│   │   ├── patients/               ← Rebuild list + profile
│   │   ├── pharmacy/               ← NEW
│   │   ├── lab/                    ← NEW
│   │   ├── smart-clinic/           ← Rebuild Digital Twin
│   │   └── [...slug]/              ← Better placeholders
│   ├── api/                        ← Keep existing, extend
│   ├── layout.tsx                  ← Root layout + fonts
│   └── globals.css                 ← Design tokens
├── components/
│   ├── ui/                         ← Full design system (shadcn)
│   ├── layout/                     ← Shell, sidebar, header
│   ├── patients/                   ← Patient forms, tables
│   ├── dashboard/                  ← Dashboard widgets
│   └── smart-clinic/               ← Vitals, charts
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
│   └── validations/
└── types/
    └── hims.ts                     ← Keep as source of truth for routes
```

---

## 12. Deliverables Checklist

When redesign is complete, we should have:

- [ ] Professional login page
- [ ] Redesigned app shell (sidebar + header)
- [ ] Dashboard with real widgets (no 3D gimmicks)
- [ ] Patient Registration — full form with all sections
- [ ] Patient Records — search, table, pagination
- [ ] Patient Profile — tabbed detail view
- [ ] Digital Twin — vital gauges + live chart
- [ ] Polished "Coming Soon" pages for remaining modules
- [ ] Consistent design system (colors, typography, spacing)
- [ ] SVG logo and favicon
- [ ] Mobile-responsive layout
- [ ] Loading skeletons and error states
- [ ] Toast notifications
- [ ] Role-based sidebar filtering (UI level)

---

## 13. What NOT to Do

- Do not copy the legacy BHAVYA HIMS UI (old government software look)
- Do not use rainbow gradients on every card
- Do not add 3D animations to a hospital dashboard
- Do not use emojis in clinical UI copy
- Do not hardcode user names / clinic names
- Do not build all 22 modules at once — focus on quality of core 5 pages first
- Do not introduce a new framework (stay on Next.js + Tailwind)
- Do not remove working API routes

---

## 14. How to Run the Project

```bash
cd MEDATHON
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed          # optional sample data
npm run dev              # http://localhost:3000
```

Optional AI/IoT API:
```bash
cd services/ai-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 15. Team Context

This is a **10-month MDP (Major Design Project)** for an engineering college:

| Member | Role |
|--------|------|
| Abhinav Shekhar | Lead / Frontend + Mobile |
| D.K. Harshith | IoT Engineer |
| Bhumikha Bayari | Embedded Systems |
| Aarya P. Verma | AI Engineer |
| Gopalakrishnan | Backend & Cloud |

The web UI is the **primary demo surface** for presentations and hackathons. It must look impressive and production-ready.

---

## 16. Prompt to Give Another AI

Copy-paste this:

> **Task:** Redesign and rebuild the MEDATHON healthcare web app frontend. Read `docs/WEB_REDESIGN_BRIEF.md` in the repo for full context.
>
> **Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma. Use shadcn/ui for components.
>
> **Priority pages:** Login → App Shell → Dashboard → Patient Registration → Patient Records → Patient Profile → Digital Twin.
>
> **Style:** Professional healthcare SaaS — clean, trustworthy, spacious. Think Linear/Stripe dashboard quality. No gimmicky 3D or rainbow gradients.
>
> **Keep:** Existing API routes, Prisma schema, `src/types/hims.ts` navigation map, database models.
>
> **Remove:** 3D hero canvas, tilt cards, ambient background, floating banner, emoji greetings.
>
> **Add:** Proper design system, logo, role-based UI, full patient registration form per `docs/DATA_MODELS/pages/`, polished empty/loading states.
>
> Start by setting up shadcn/ui, defining design tokens in `globals.css`, rebuilding the app shell, then the dashboard.

---

*Generated: 2026-09-15. Attach this file to any AI coding assistant along with the repo.*
