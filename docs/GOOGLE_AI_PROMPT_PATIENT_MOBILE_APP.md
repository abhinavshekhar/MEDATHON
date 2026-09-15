# Google AI Studio Prompt — MEDATHON Patient Mobile App

> **Step 1:** Paste `docs/GOOGLE_AI_PROMPT_MASTER.md` into Google AI Studio first.  
> **Step 2:** Paste everything below into the **same chat**.

---

## PROMPT (copy from here)

You are an expert mobile app developer. Build the **Patient Mobile App** for **MEDATHON** — part of a **Digital Twin** system where Mobile, Kiosk, and Desktop all share the **same database and same project folder**.

### SAME FOLDER RULE (mandatory)

Work **only** inside the existing `MEDATHON/` monorepo. Do not create a new project.

| What | Where to put code |
|------|-------------------|
| Web mobile app (enhance) | `MEDATHON/src/app/patient-app/` |
| Native app (if building) | `MEDATHON/mobile/` |
| Shared QR logic | Import from `MEDATHON/src/lib/patient-qr.ts` |
| Shared vitals logic | Import from `MEDATHON/src/lib/vitals-engine.ts` |
| APIs | Use existing `MEDATHON/src/app/api/` — do not duplicate |

### Digital twin role of this app

This mobile app is a **digital twin node**. Everything the patient does here syncs to Kiosk and Desktop:

| Action on mobile | Syncs to |
|----------------|----------|
| Register patient | Desktop dashboard + Kiosk lookup |
| Show ABDM QR | Kiosk scans same QR → loads same patient |
| View vitals | Same `VitalLog` rows captured at kiosk |
| View appointments | Same `OPDVisit` table as desktop |
| View lab/Rx | Same records doctor sees on desktop |

After kiosk captures vitals, patient refreshes mobile home → vitals appear (from `GET /api/vitals?patientId=`).

### Context

MEDATHON is a 3-app digital twin system (same `MEDATHON/` folder):
- **Desktop HIMS** — `src/app/(app)/` — doctors, Digital Twin monitor
- **Kiosk tablet** — `src/app/kiosk/` — reception vitals
- **Patient mobile** — `src/app/patient-app/` + `mobile/` — **you build this**

The patient app lets users self-register, log in, view their **ABDM health card with QR**, see **kiosk-synced vitals**, view appointments, and access diagnosis/lab records.

### Branding

| Item | Value |
|------|-------|
| App name | **MEDATHON** |
| Tagline | Smart Healthcare · Chennai |
| Primary color | Teal `#05968c` |
| Dark accent | Navy `#071421` |
| Region | Chennai, Tamil Nadu, India |
| Language | English (Tamil labels optional as secondary) |

**Do NOT** use placeholder names like "John Doe". Use realistic South Indian names (Priya Subramanian, Karthik Iyer, etc.).

### Tech stack (choose one and commit)

**Option A (preferred for hackathon):** React Native + Expo + TypeScript  
**Option B:** Flutter + Dart  
**Option C:** Kotlin Jetpack Compose (Android only)

Use Material Design 3 / modern mobile UI. Must work on Android phones (primary) and look good on iOS.

### Backend API (already running)

Base URL: `http://<SERVER_IP>:3000` (configurable in app settings)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/patients?q={mobile}` | GET | Search patient by mobile number |
| `/api/patients/{id}` | GET | Full patient profile + visits + vitals + lab + prescriptions |
| `/api/patients` | POST | Register new patient (JSON body) |
| `/api/patients/lookup/{patientNo}` | GET | Lookup by patient ID e.g. `P-CHN-20260915-0001` |
| `/api/vitals?patientId={id}` | GET | Patient vital history from kiosk |

**Registration POST body example:**
```json
{
  "firstName": "Priya",
  "lastName": "Subramanian",
  "ageYears": 28,
  "gender": "FEMALE",
  "mobile": "9876543210",
  "district": "Chennai",
  "state": "Tamil Nadu",
  "address": "Ward 42, T Nagar, Chennai, Tamil Nadu — 600017",
  "opdType": "General OPD",
  "doctorName": "Dr. Priya Subramanian",
  "referredBy": "Self / Walk-in",
  "reason": "Routine checkup",
  "feeAmount": 0,
  "paymentCollected": true
}
```

**Gender values:** `MALE` or `FEMALE` only.

### QR code format (ABDM card)

Generate QR as JSON string:
```json
{
  "type": "medathon-patient",
  "patientNo": "P-CHN-20260915-0001",
  "patientId": "<cuid>",
  "name": "Priya Subramanian",
  "abha": "priya.subramanian@abdm"
}
```

Kiosk scans this QR to load the patient. Use a QR library to display on the ABDM card screen.

---

### Screens to build (all required)

#### 1. Splash + Onboarding
- MEDATHON logo area (text + medical cross icon)
- "Chennai · Tamil Nadu"
- Skip to login

#### 2. Login
- Login with **mobile number** (10 digits, India)
- Calls `GET /api/patients?q={mobile}` and matches exact mobile
- Roles: show only **Patient** login (not admin/doctor on this app)
- Link: "New patient? Register"
- Store session in secure local storage

#### 3. Self Registration (multi-step)
- **Step 1:** Name, age, gender (Male/Female)
- **Step 2:** Mobile, address, district (default Chennai), PIN code
- **Step 3:** OPD type, reason for visit, doctor (dropdown of Chennai doctors)
- Submit → `POST /api/patients`
- On success → go to home with new session

#### 4. Home dashboard
- Greeting with patient name
- Patient ID (`P-CHN-…`) in monospace
- Cards:
  - **ABDM Health Card** → navigate to card screen
  - **Latest vitals** (from kiosk sync) — BPM, SpO2, temperature
  - **Upcoming appointments** (from visits array)
  - **My records** — diagnosis, lab, prescriptions summary
- Pull-to-refresh vitals from API

#### 5. ABDM Health Card
- Visual card styled like Indian government health ID (orange/amber header, demo disclaimer)
- Patient photo placeholder (initials avatar, colored by age)
- Name, patient number, ABHA address
- **Large QR code** (scannable at kiosk)
- Button: "Download demo PDF" (optional — can open web link)
- Button: "Show at kiosk" with instructions

#### 6. Vitals history
- List/chart of vitals from `/api/vitals?patientId=`
- Show source: "Captured at reception kiosk"
- Empty state: "Visit the kiosk after your appointment"

#### 7. Appointments
- List OPD visits: type, doctor, status, date
- Status badges: REGISTERED, IN_QUEUE, WITH_DOCTOR, COMPLETED

#### 8. Diagnosis & records
- Tabs: **Visits** | **Lab** | **Prescriptions**
- Data from `GET /api/patients/{id}`
- Read-only for patients

#### 9. Profile & settings
- Edit mobile, address
- Sign out
- Server URL config (for demo on different machines)

---

### UI requirements

- **Modern, premium** — not generic Bootstrap. Think Practo / Paytm Health quality.
- Large touch targets, bottom navigation (Home, Card, Vitals, Records, Profile)
- Skeleton loaders, empty states with illustrations
- Error toasts for API failures
- Offline message when server unreachable
- Support dark mode optional

### Data rules

- Use **real API data** — no hardcoded fake patient lists
- Chennai districts: T Nagar, Anna Nagar, Adyar, Velachery, Tambaram, etc.
- Tamil Nadu state, PIN codes 600001–600126
- Government schemes shown as badges if present: PMJAY, BPL

### Security & privacy

- Mask Aadhaar as `XXXX XXXX 1234` — never show full number
- Label all ID cards: **"DEMO / SAMPLE — NOT OFFICIAL AADHAAR"**
- No real Aadhaar collection in forms

### Demo flow (must work end-to-end)

1. Patient registers in mobile app
2. Opens ABDM card → shows QR
3. At kiosk, staff scans QR → vitals captured
4. Patient refreshes home → sees new vitals
5. Doctor sees same vitals on desktop Digital Twin

### Deliverables

1. Full source code with folder structure
2. `README.md` with setup (`npm install` / `expo start` / `flutter run`)
3. Environment config for `API_BASE_URL`
4. Screenshots description for each screen
5. List of dependencies

### Do NOT

- Create a new repo — stay in `MEDATHON/`
- Duplicate APIs outside `src/app/api/`
- Use a different QR format than `src/lib/patient-qr.ts`
- Store vitals locally only — must sync via shared API
- Build admin or doctor features in this app
- Use transgender gender option
- Use Bihar or North India sample data — **Chennai/Tamil Nadu only**
- Use "Coming soon" placeholders — every screen must be functional with API

Start by reading `src/app/patient-app/page.tsx` and `src/lib/patient-qr.ts` in the MEDATHON folder, then enhance/build screen by screen.

---

## END OF PROMPT

### Tips for Google AI Studio

1. Paste **`GOOGLE_AI_PROMPT_MASTER.md`** first (same chat)
2. Then paste this mobile app prompt
3. Say: *"Work inside MEDATHON/ folder. Enhance src/app/patient-app/ and/or build in mobile/. All apps are digital twinned."*
4. Follow up: *"Read src/lib/patient-qr.ts and src/app/patient-app/page.tsx first, then build Login + Home + ABDM Card."*
5. Set server IP: *"API base URL is http://192.168.x.x:3000 — same server as kiosk and desktop."*
6. Upload the whole `MEDATHON` folder to Gemini if file upload is available
