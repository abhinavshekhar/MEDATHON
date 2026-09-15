# MEDATHON Kiosk — Standalone Tablet Website

Separate reception kiosk app that integrates with the main **MEDATHON HIMS** backend.

## Architecture

```
Kiosk website (this app)          Main HIMS (separate site)
https://medathon-kiosk.vercel.app → https://medathon-ten.vercel.app
        │                                    │
        ├── POST /api/vitals                 ├── Prisma DB
        ├── GET  /api/vitals                 ├── Digital Twin
        └── GET  /api/patients/lookup        └── Doctor dashboard
```

## Local dev

```bash
cd kiosk-web
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 — API calls proxy to `VITE_API_BASE_URL`.

## Deploy (Vercel)

1. Import repo with **Root Directory** = `kiosk-web`
2. Set env: `VITE_API_BASE_URL=https://medathon-ten.vercel.app`
3. Deploy

## Tablet setup

1. Open kiosk URL in Chrome on 11″ tablet
2. **Add to Home screen** / install PWA
3. Enable fullscreen (kiosk browser or app pinning)
4. Optional: set device ID in browser console:
   ```js
   localStorage.setItem('medathon_kiosk_device_id', 'KIOSK-RECEPTION-01')
   ```

## Flow

1. Welcome → Scan ABDM QR or enter patient ID
2. Confirm patient profile
3. Capture vitals (3s sensor simulation)
4. POST vitals → main HIMS database
5. Digital Twin on desktop updates within 5s
