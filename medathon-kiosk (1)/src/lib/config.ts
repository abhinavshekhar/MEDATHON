/**
 * MEDATHON Kiosk Configuration
 * 11-inch Reception Tablet Node — Chennai Urban Health Centre
 */

export const KIOSK_CONFIG = {
  // Device identity
  deviceId: (typeof window !== 'undefined' && localStorage.getItem('medathon_kiosk_device_id')) || 'KIOSK-01',
  
  // Clinic branding
  clinicName: 'MEDATHON Urban Health Centre',
  clinicLocation: 'Chennai, Tamil Nadu',
  clinicSubdivision: 'Zone 09 — T. Nagar / Mylapore Cluster',
  
  // API Base URL - defaults to window origin or current server IP
  apiBaseUrl: (typeof window !== 'undefined' && localStorage.getItem('medathon_api_base_url')) || '',
  
  // Vitals sensor configuration
  scanDurationMs: 3000,
  autoResetDurationSec: 8,
  
  // Tablet display specifications
  tabletSpecs: {
    screenSize: '11.0"',
    resolution: '2000 x 1200 (2K)',
    connectivity: '5G + Wi-Fi 6',
    orientation: 'LANDSCAPE_LOCKED'
  }
};

export function setKioskDeviceId(id: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('medathon_kiosk_device_id', id);
  }
}

export function setApiBaseUrl(url: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('medathon_api_base_url', url);
  }
}
