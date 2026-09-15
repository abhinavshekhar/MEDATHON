/**
 * MEDATHON Kiosk — standalone reception tablet site
 * Connects to main HIMS at VITE_API_BASE_URL (medathon-ten.vercel.app)
 */

export const KIOSK_CONFIG = {
  deviceId:
    (typeof window !== "undefined" && localStorage.getItem("medathon_kiosk_device_id")) ||
    "KIOSK-RECEPTION-01",
  clinicName: "MEDATHON Urban Health Centre",
  clinicLocation: "Chennai, Tamil Nadu",
  clinicSubdivision: "Zone 09 — T. Nagar / Mylapore Cluster",
  scanDurationMs: 3000,
  autoResetDurationSec: 8,
  tabletSpecs: {
    screenSize: '11.0"',
    resolution: "2000 x 1200 (2K)",
    connectivity: "5G + Wi-Fi 6",
    orientation: "LANDSCAPE_LOCKED",
  },
};

export function setKioskDeviceId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("medathon_kiosk_device_id", id);
  }
}

export function setApiBaseUrl(url: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("medathon_api_base_url", url.replace(/\/$/, ""));
  }
}
