/**
 * Shared QR Parser and Generator for MEDATHON Digital Twin
 */

import QRCode from 'qrcode';
import { PatientQrPayload } from '../types';

/**
 * Parses scanned QR text.
 * Accepts:
 * 1. JSON payload: { "type": "medathon-patient", "patientNo": "P-CHN-...", ... }
 * 2. Plain text patient ID: "P-CHN-20260915-0001"
 * 3. Text containing patient number matching regex: P-CHN-\d{8}-\d{4} or similar
 */
export function parsePatientQr(rawText: string): PatientQrPayload | { patientNo: string } | null {
  if (!rawText || typeof rawText !== 'string') return null;

  const trimmed = rawText.trim();

  // 1. Try parsing JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.patientNo === 'string') {
        return {
          type: 'medathon-patient',
          patientNo: parsed.patientNo.trim().toUpperCase(),
          patientId: parsed.patientId,
          name: parsed.name,
          abha: parsed.abha || parsed.abhaAddress
        };
      }
    } catch {
      // Fall through to regex match
    }
  }

  // 2. Exact or partial match for MEDATHON patient ID pattern (e.g. P-CHN-20260915-0001)
  const pattern = /P-[A-Z]{3}-\d{8}-\d{4}/i;
  const match = trimmed.match(pattern);
  if (match) {
    return {
      type: 'medathon-patient',
      patientNo: match[0].toUpperCase()
    };
  }

  // 3. Fallback: if it's a short alphanumeric ID starting with P-
  if (/^P-[A-Z0-9-]+$/i.test(trimmed)) {
    return {
      type: 'medathon-patient',
      patientNo: trimmed.toUpperCase()
    };
  }

  return null;
}

/**
 * Generates a QR Code as a Data URL for a patient record
 */
export async function generatePatientQrCode(payload: PatientQrPayload): Promise<string> {
  try {
    const jsonStr = JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(jsonStr, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate patient QR code', err);
    throw err;
  }
}
