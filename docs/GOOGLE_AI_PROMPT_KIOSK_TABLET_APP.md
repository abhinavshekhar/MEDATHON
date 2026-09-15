# Google AI Studio Prompt — MEDATHON Kiosk Tablet App

> **Step 1:** Paste `docs/GOOGLE_AI_PROMPT_MASTER.md` into Google AI Studio first.  
> **Step 2:** Paste everything below into the **same chat**.

---

## PROMPT (copy from here)

You are an expert developer building the **Kiosk Tablet App** for **MEDATHON** — an **11-inch Android tablet** (A11 + 5G) at reception in **Chennai, Tamil Nadu**. This app is a **digital twin node** — vitals captured here instantly appear on Desktop and Patient Mobile.

### SAME FOLDER RULE (mandatory)

Work **only** inside the existing `MEDATHON/` monorepo. Do not create a new project.

| What | Where to put code |
|------|-------------------|
| Kiosk web app (enhance) | `MEDATHON/src/app/kiosk/` |
| Kiosk layout | `MEDATHON/src/app/kiosk/layout.tsx` |
| Shared QR parser | Import from `MEDATHON/src/lib/patient-qr.ts` |
| Shared vitals formula | Import from `MEDATHON/src/lib/vitals-engine.ts` |
| Vitals API | Use `MEDATHON/src/app/api/vitals/route.ts` |
| Patient lookup | Use `MEDATHON/src/app/api/patients/lookup/[patientNo]/route.ts` |
| Reference implementation | Read `MEDATHON/src/app/kiosk/page.tsx` first |

### Digital twin role of this app

The kiosk is the **vitals capture twin**. It reads patient identity from Mobile/Desktop QR and writes vitals back to the shared database:

```
Mobile ABDM QR  ──scan──►  Kiosk  ──POST /api/vitals──►  Database
                                                              │
Desktop Digital Twin ◄──poll GET /api/vitals──────────────────┘
Mobile vitals tab  ◄──poll GET /api/vitals──────────────────┘
```

| Kiosk action | Digital twin sync |
|--------------|-------------------|
| Scan QR from patient phone | Loads same patient as mobile/desktop |
| Capture vitals | `POST /api/vitals` → `VitalLog` table |
| Success screen | Desktop Digital Twin updates within 5s |
| | Mobile app shows vitals on refresh |

### Context

3-app system in **one folder** (`MEDATHON/`):

| App | Folder | User | Device |
|-----|--------|------|--------|
| Desktop HIMS | `src/app/(app)/` | Doctors, staff | PC |
| **Kiosk tablet** | `src/app/kiosk/` | Patients | **11″ tablet** |
| Patient mobile | `src/app/patient-app/` | Patients | Phone |

**Flow:**
1. Patient registers on mobile (`/patient-app`) or desktop (`/opd/registration`)
2. Patient shows **ABDM QR** from mobile or printed ID PDF
3. Kiosk scans QR (parse with `src/lib/patient-qr.ts`)
4. Kiosk shows patient profile (avatar from name/age — real data, not random demo)
5. Kiosk captures vitals using `src/lib/vitals-engine.ts` formula
6. `POST /api/vitals` → **Digital Twin** on desktop + mobile vitals tab update

### Branding

| Item | Value |
|------|-------|
| App name | **MEDATHON Kiosk** |
| Clinic | MEDATHON Urban Health Centre — Chennai |
| Colors | Dark background `#0f172a`, teal accent `#05968c`, white text |
| Layout | Landscape-first, fullscreen, no browser chrome |

### Tech stack (choose one)

**Option A (preferred):** React Native + Expo (tablet mode, landscape lock)  
**Option B:** Kotlin + Jetpack Compose (Android tablet native)  
**Option C:** Next.js PWA in kiosk browser mode (fullscreen web)

Must run fullscreen on 11″ tablet. Large fonts, high contrast, touch-friendly.

### Backend API

Base URL: `http://<SERVER_IP>:3000`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/patients/lookup/{patientNo}` | GET | Load patient after QR scan |
| `/api/vitals` | POST | Save captured vitals |
| `/api/vitals?patientId={id}` | GET | Verify vitals saved |

**QR scan payload (JSON in QR code):**
```json
{
  "type": "medathon-patient",
  "patientNo": "P-CHN-20260915-0001",
  "patientId": "clxxx...",
  "name": "Priya Subramanian",
  "abha": "priya.subramanian@abdm"
}
```

Also accept plain patient ID text: `P-CHN-20260915-0001`

**Lookup response includes:**
```json
{
  "id": "cuid",
  "patientNo": "P-CHN-20260915-0001",
  "name": "Priya Subramanian",
  "ageYears": 28,
  "gender": "FEMALE",
  "district": "Chennai",
  "state": "Tamil Nadu",
  "abhaAddress": "priya.subramanian@abdm",
  "visits": [{ "id": "...", "visitId": "V-CHN-...", "opdType": "General OPD", "status": "REGISTERED" }],
  "vitalLogs": []
}
```

**POST vitals body:**
```json
{
  "patientId": "<cuid from lookup>",
  "visitId": "<visit cuid optional>",
  "bpm": 72,
  "spo2": 97,
  "temperature": 36.6
}
```

### Vitals calculation (important)

Do **NOT** use random demo numbers. Derive vitals from patient record:

```
baseBpm = gender === FEMALE ? 72 : 68
bpm = baseBpm + (ageYears % 25) + (ageYears > 60 ? 8 : 0)
spo2 = min(99, 95 + (ageYears % 5))
temperature = 36.4 + (ageYears % 8) * 0.05
```

Show a 2–3 second "scanning" animation before displaying results.

---

### Screens / states (fullscreen flow)

#### State 1: Attract / Welcome
- Fullscreen dark UI
- "Welcome to MEDATHON"
- "Chennai · Vitals Check-in"
- Pulsing "Scan QR to begin" prompt
- Small: kiosk online indicator (green dot)
- Hidden admin tap: enter patient ID manually

#### State 2: QR Scanner
- Use device camera to scan QR (or manual text input fallback)
- Parse JSON QR payload or plain `P-CHN-…` ID
- On success → fetch `/api/patients/lookup/{patientNo}`
- On error → "Patient not found. Please register at reception."

#### State 3: Patient profile confirmation
- **Large avatar** — colored circle with patient initial (hue based on age)
- Patient name (large text)
- Patient ID, age, gender, district
- ABHA address if present
- Today's visit: OPD type + status badge
- Big button: **"Start vitals capture"**

#### State 4: Vitals capture (animated)
- Full-screen vitals UI like hospital monitor
- Three large gauges:
  - ❤️ Heart rate (BPM)
  - 🫁 SpO₂ (%)
  - 🌡️ Temperature (°C)
- Progress animation 0→100% over 3 seconds
- "Reading sensors…" (simulated — real ESP32 can replace later)
- Values animate up to calculated vitals

#### State 5: Success + sync
- Green checkmark
- "Vitals synced to Digital Twin"
- Show final readings
- Message: "Please proceed to waiting area. Doctor will see your vitals."
- Auto-reset to State 1 after 8 seconds OR "Next patient" button

---

### UI requirements (11″ tablet)

- **Landscape orientation** locked
- Minimum button height: 56px
- Font sizes: headings 32px+, vitals numbers 64px+
- No sidebar, no browser URL bar (kiosk mode)
- High contrast for clinic lighting
- Tamil + English labels optional (e.g. "நிகழ்வitals" / "Vitals")
- No "Coming soon" — all states functional

### Patient face / avatar

- Do NOT use stock photos or random faces
- Use **initials avatar** with background color derived from `ageYears * 3` (HSL hue)
- Optionally show age and gender under name
- This satisfies "demo face according to their age, look" without fake photos

### QR sources the kiosk must accept

1. Patient mobile app ABDM QR
2. Printed Aadhaar demo PDF QR (same JSON format)
3. Manual entry of patient number

### Integration with desktop

After `POST /api/vitals`, desktop app at `/smart-clinic/digital-twin` polls vitals by patient ID and shows live chart. Kiosk should show brief "Synced ✓" confirmation.

Optional FastAPI forward (already handled by server):
`POST http://localhost:8000/api/vitals` — kiosk does not need to call this directly.

### Hardware notes (future ESP32)

Leave a `// TODO: WebSocket ws://server:8000/ws/vitals` hook for real MAX30102 sensor data. For now, simulated capture using patient-derived vitals is correct.

### Error handling

- Network offline → "Cannot reach clinic server. Check Wi-Fi."
- Patient not found → return to scan with clear message
- Timeout on API → retry button

### Deliverables

1. Complete kiosk app source code
2. `README.md` — install on Android tablet, kiosk mode setup, set API URL
3. Instructions to lock app to landscape fullscreen
4. Config file for `API_BASE_URL` and `KIOSK_DEVICE_ID` (default `KIOSK-01`)

### Do NOT

- Create a new repo — stay in `MEDATHON/`
- Duplicate APIs — use `src/app/api/vitals/route.ts`
- Use different QR format than `src/lib/patient-qr.ts`
- Use random vitals — must use `src/lib/vitals-engine.ts`
- Show fake patient names unrelated to API response
- Include doctor/admin registration flows
- Use North India / Bihar sample data
- Exit to browser or show unrelated apps (kiosk lock guidance in README)

### Demo script (digital twin end-to-end)

1. **Mobile** (`/patient-app`) → patient logs in → ABDM QR visible
2. **Kiosk** (`/kiosk`) → scan QR → patient profile loads
3. Kiosk → capture vitals → "Synced to Digital Twin" success
4. **Desktop** (`/smart-clinic/digital-twin`) → enter patient ID → vitals visible
5. **Mobile** → refresh home → same vitals appear

All four steps use the **same `MEDATHON/` folder, same database, same APIs**.

Start by reading `src/app/kiosk/page.tsx` and `src/lib/vitals-engine.ts`, then enhance the 5-state kiosk flow.

---

## END OF PROMPT

### Tips for Google AI Studio

1. Paste **`GOOGLE_AI_PROMPT_MASTER.md`** first (same chat)
2. Then paste this kiosk prompt
3. Say: *"Work inside MEDATHON/src/app/kiosk/. Digital twin with mobile and desktop. Same APIs, same folder."*
4. Follow up: *"Read src/app/kiosk/page.tsx and src/lib/vitals-engine.ts, then enhance QR scan + vitals sync."*
5. Server IP: *"Backend at http://192.168.x.x:3000 — vitals sync to /smart-clinic/digital-twin"*
6. Upload the whole `MEDATHON` folder to Gemini if supported

### Related files in MEDATHON repo (same folder — read all before coding)

| File | Purpose |
|------|---------|
| `docs/GOOGLE_AI_PROMPT_MASTER.md` | Digital twin architecture + folder rules |
| `src/app/kiosk/page.tsx` | Current kiosk — enhance, don't replace blindly |
| `src/app/patient-app/abdm/page.tsx` | QR that kiosk must scan |
| `src/app/(app)/smart-clinic/digital-twin/page.tsx` | Desktop twin that receives vitals |
| `src/lib/vitals-engine.ts` | Age/gender vitals formula (shared) |
| `src/lib/patient-qr.ts` | QR JSON format (shared) |
| `src/app/api/vitals/route.ts` | Vitals POST → DB + FastAPI forward |
| `patient dataset/patients.json` | 2000 Chennai patients |
| `aadhaar id dataset/records.json` | 2000 ID cards with QR |
