# MEDATHON Kiosk Tablet App — Chennai Digital Twin

> **11-inch Reception Tablet Node (A11 + 5G)**  
> **Location:** MEDATHON Urban Health Centre — Chennai, Tamil Nadu  
> **Role:** Digital Twin Vitals Capture Node  

---

## 1. Overview & Architecture

The **MEDATHON Kiosk** serves as the automated clinical intake and vitals capture node at the clinic reception. It connects patients, doctors, and health records into a synchronized digital twin loop:

```
Patient Mobile ABDM QR ──scan──► Kiosk Tablet ──POST /api/vitals──► Database
                                                                         │
Desktop Digital Twin ◄──────poll GET /api/vitals (<5s)───────────────────┤
Patient Mobile Vitals Tab ◄─poll GET /api/vitals─────────────────────────┘
```

1. **State 1 (Attract / Welcome):** High-contrast fullscreen dark reception display (`#0f172a`, teal `#05968c`), live 5G status indicator, pulsing "Scan QR" prompt, Tamil/English language toggle.
2. **State 2 (QR Scanner):** Live camera QR code scanner powered by `jsQR` with animated laser reticle, accepting ABDM JSON payloads, printed ID cards, and manual `P-CHN-…` registration IDs.
3. **State 3 (Patient Profile Confirmation):** Visual verification with age-derived initials avatar (`hsl(${(ageYears * 15) % 360}, 65%, 25%)`), demographics, Chennai district, ABHA ID, and today's OPD token.
4. **State 4 (Vitals Capture Monitor):** Hospital telemetry monitor UI with animated ECG lead trace, reading sensors over 3 seconds and calculating vitals strictly derived from patient records (`src/lib/vitals-engine.ts`).
5. **State 5 (Success + Sync):** Green confirmation checkmark, "Vitals synced to Digital Twin" confirmation, summary of vital signs, and an 8-second auto-reset countdown for the next patient.

---

## 2. Configuration (`API_BASE_URL` and `KIOSK_DEVICE_ID`)

The configuration file is located at `src/lib/config.ts`:

```typescript
export const KIOSK_CONFIG = {
  deviceId: localStorage.getItem('medathon_kiosk_device_id') || 'KIOSK-01',
  clinicName: 'MEDATHON Urban Health Centre',
  clinicLocation: 'Chennai, Tamil Nadu',
  apiBaseUrl: localStorage.getItem('medathon_api_base_url') || '',
  scanDurationMs: 3000,
  autoResetDurationSec: 8
};
```

To configure on a physical tablet:
- **Set Kiosk Device ID:** Open browser DevTools or console: `localStorage.setItem('medathon_kiosk_device_id', 'KIOSK-RECEPTION-01')`
- **Set Backend API URL:** `localStorage.setItem('medathon_api_base_url', 'http://192.168.1.100:3000')`

---

## 3. Installation & Setup on 11-inch Android Tablet

### Method A: Fully Kiosk Browser (Recommended for Production)
1. Install **Fully Kiosk Browser & Lockdown** from Google Play Store or APK.
2. Open Fully Kiosk Settings:
   - **Start URL:** `http://<SERVER_IP>:3000` (or the deployed Cloud Run URL).
   - **Web Zoom and Scaling:** Set to `100%` or adjust to match 2000x1200 2K tablet density.
   - **Screen Orientation:** Select **Landscape** (`Lock Landscape`).
   - **Kiosk Mode (Plus):** Enable **Lock Screen & Disable Home/Back Buttons**.
   - **Motion Detection / Screen Saver:** Keep screen awake during clinic hours (08:00–20:00).
   - **Camera Permission:** Grant **Always Allow** for QR scanner.

### Method B: Chrome PWA / Android App Pinning
1. Open Google Chrome on the tablet and navigate to `http://<SERVER_IP>:3000`.
2. Tap the browser menu `⋮` and select **"Add to Home screen"** or **"Install app"**.
3. Go to Android **Settings → Security & Privacy → More security settings → App pinning**.
4. Enable **App pinning** and require PIN to unpin.
5. Open the MEDATHON Kiosk app and pin the screen.

---

## 4. Landscape Orientation Locking

To ensure the tablet never rotates into portrait mode during patient usage:
- **CSS Guard:** The layout uses `w-screen h-screen overflow-hidden select-none` and responsive grid calculations tuned for 16:10 / 16:9 landscape aspect ratios.
- **Android System Lock:** In Android Settings, turn off **Auto-rotate** and lock display in **Landscape**.
- **Web App Manifest:** Uses `"orientation": "landscape"` in manifest configuration.

---

## 5. Hardware Sensor Integration Hook (ESP32 MAX30102)

The application includes an integration hook in `src/lib/vitals-engine.ts` and `src/components/StateCapture.tsx`:

```typescript
// TODO: WebSocket ws://server:8000/ws/vitals - Hardware hook for real MAX30102 sensor data
```

When an ESP32 pulse oximeter microcontroller is attached to the tablet via USB-OTG or local WebSocket, raw photoplethysmogram (PPG) IR/Red LED readings can stream directly to this hook.

---

## 6. Digital Twin Testing Script

1. **Step 1:** Open the **Patient QRs** modal (top header) and choose any Chennai patient (e.g. *Priya Subramanian* or *Karthik Selvam*).
2. **Step 2:** Click **"Simulate Scan on Kiosk"** (or hold up a real camera to the displayed QR code).
3. **Step 3:** Confirm the patient's identity and click **"Start Vitals Capture"**.
4. **Step 4:** Watch the 3-second hospital ECG telemetry monitor compute the clinical vitals.
5. **Step 5:** On the Success screen, click **"Verify Digital Twin"** to open the live inspector showing `GET /api/vitals?patientId=...` reflecting the data on Desktop and Mobile instantly.
