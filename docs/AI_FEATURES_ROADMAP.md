# AI Features Roadmap (New Platform)

> Planned enhancements beyond legacy BHAVYA HIMS functionality.

## Phase 1 — Smart Registration
- **AI Patient Search** — Fuzzy match across name, mobile, ABHA; duplicate detection with confidence score
- **Voice-to-Form** — Hindi/English voice input for patient demographics (rural health worker friendly)
- **ABHA Auto-Link** — OCR Aadhaar card → auto-fill demographics + ABHA creation
- **Smart Scheme Eligibility** — Auto-suggest PMJAY/BPL/RBSK based on demographics and location

## Phase 2 — Clinical Intelligence
- **Symptom Checker** — Triage assistant for OPD reason field; suggest department/doctor
- **Drug Interaction Alerts** — Real-time pharmacy warnings on dispense
- **Lab Result Interpreter** — Plain-language explanation of abnormal values for patients
- **Dengue Outbreak Predictor** — ML on lab data + geography for early warning

## Phase 3 — Operations & MIS
- **Natural Language MIS** — "How many OPD registrations this week?" chat interface
- **Predictive Stock** — Medicine reorder suggestions from dispensing patterns
- **Roster Optimizer** — AI-suggested doctor schedules based on patient load
- **Anomaly Detection** — Flag unusual billing, duplicate registrations, data entry errors

## Phase 4 — Patient Engagement
- **WhatsApp/SMS Bot** — Appointment reminders, lab report delivery, follow-up nudges
- **Multilingual UI** — Hindi, Bhojpuri, Maithili interface options
- **Digital Health Records** — Patient-facing portal with ABHA-linked history

## Tech Stack for AI Layer

```
┌─────────────────────────────────────────┐
│  Next.js Frontend (new UI/UX)           │
├─────────────────────────────────────────┤
│  API Gateway (Node.js / FastAPI)        │
├──────────┬──────────┬───────────────────┤
│ Patient  │ OPD/Lab  │ AI Service        │
│ Service  │ Pharmacy │ (OpenAI/Local LLM)│
├──────────┴──────────┴───────────────────┤
│  PostgreSQL + Redis + S3 (documents)    │
└─────────────────────────────────────────┘
```

## Branding Placeholders

| Item | Current (BHAVYA) | Your New Brand |
|------|------------------|----------------|
| App Name | BHAVYA HIMS | _TBD_ |
| Logo | MediXcel™ | _Your logo_ |
| Tagline | Bihar State Health System Digitization | _TBD_ |
| Primary Color | Government blue | _TBD_ |
