# MEDATHON Staff Mobile App

Kotlin + Jetpack Compose app for **Project 2: AI-Powered Smart Clinic**.

## Purpose

- View live patient queue
- Push e-prescriptions to pharmacy
- Receive vitals alerts from kiosk
- Quick patient lookup

## Planned Stack

| Layer | Technology |
|-------|------------|
| UI | Jetpack Compose, Material 3 |
| Networking | Retrofit + OkHttp |
| Real-time | WebSocket (vitals / queue) |
| Auth | Supabase Auth (shared with web) |
| API | Next.js `/api/v1/*` + FastAPI telemetry |

## Project Structure (to create)

```
mobile/
├── app/
│   └── src/main/java/com/medathon/
│       ├── ui/          # Compose screens
│       ├── data/        # API models, repositories
│       └── MainActivity.kt
├── build.gradle.kts
└── settings.gradle.kts
```

## Screens (planned)

1. **Login** — staff credentials
2. **Queue** — today's OPD patients with status
3. **Patient Detail** — vitals sparkline, history
4. **E-Prescription** — add medicines, send to pharmacy

## Team

**Abhinav Shekhar** — Kotlin mobile app, queue UI, API integration

## Status

Not yet initialized — run Android Studio → New Project → Empty Compose Activity, package `com.medathon`.

Point `BASE_URL` to Next.js API: `http://<server>:3000/api/v1`
