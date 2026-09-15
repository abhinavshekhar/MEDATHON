# Smart Vitals Kiosk — ESP32 Firmware

Hardware for **Project 2: AI-Powered Smart Clinic**.

## Components

| Part | Model | Purpose |
|------|-------|---------|
| MCU | ESP32 | WiFi + WebSocket client |
| Pulse Oximeter | MAX30102 | BPM + SpO2 |
| IR Thermometer | MLX90614 | Body temperature |
| Display | Optional OLED | Patient instructions |

## Pinout (default)

| Sensor | ESP32 Pins |
|--------|------------|
| MAX30102 SDA | GPIO 21 |
| MAX30102 SCL | GPIO 22 |
| MLX90614 SDA | GPIO 21 (shared I2C) |
| MLX90614 SCL | GPIO 22 |

## Build (PlatformIO)

```bash
cd hardware/iot
pio run -t upload
```

## Configuration

Edit `src/config.h`:
- `WIFI_SSID`, `WIFI_PASSWORD`
- `WS_SERVER` — e.g. `ws://192.168.1.100:8000/ws/vitals`
- `KIOSK_ID` — device identifier registered in `KioskDevice` table

## Data flow

1. Patient scans QR / enters visit ID on kiosk UI
2. ESP32 reads sensors for ~15 seconds
3. Firmware sends JSON over WebSocket to FastAPI (`services/ai-api`)
4. FastAPI stores in `VitalLog` (via Next.js API or direct DB in production)

## Team

- **D.K. Harshith** — ESP32 interfacing, WebSocket client, I2C
- **Bhumikha Bayari** — C++ edge filtering, PCB, 3D kiosk enclosure

## Status

Firmware scaffold — implement sensor drivers in `src/main.cpp`.
