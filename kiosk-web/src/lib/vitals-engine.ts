/**
 * Shared Vitals Engine for MEDATHON Digital Twin
 * 
 * Computes deterministic clinical vitals strictly derived from patient record
 * (Age & Gender) as mandated by MEDATHON Clinical Twin protocol.
 * 
 * // TODO: WebSocket ws://server:8000/ws/vitals - Hardware hook for real MAX30102 sensor data
 */

import { Gender } from '../types';

export interface CalculatedVitals {
  bpm: number;
  spo2: number;
  temperature: number;
  systolic: number;
  diastolic: number;
  respiratoryRate: number;
  status: 'NORMAL' | 'ELEVATED' | 'ATTENTION_REQUIRED';
  statusNotes: string[];
}

/**
 * Calculates patient vitals using the standardized MEDATHON formula.
 * Base rule:
 * baseBpm = gender === FEMALE ? 72 : 68
 * bpm = baseBpm + (ageYears % 25) + (ageYears > 60 ? 8 : 0)
 * spo2 = min(99, 95 + (ageYears % 5))
 * temperature = 36.4 + (ageYears % 8) * 0.05
 */
export function calculateVitals(ageYears: number, gender: Gender | string): CalculatedVitals {
  const isFemale = typeof gender === 'string' && gender.toUpperCase() === 'FEMALE';
  
  // Standard MEDATHON formula
  const baseBpm = isFemale ? 72 : 68;
  const bpm = baseBpm + (ageYears % 25) + (ageYears > 60 ? 8 : 0);
  const spo2 = Math.min(99, 95 + (ageYears % 5));
  const rawTemp = 36.4 + (ageYears % 8) * 0.05;
  const temperature = Number(rawTemp.toFixed(1));

  // Clinically correlated Blood Pressure and Respiration
  const ageFactor = Math.max(0, ageYears - 30);
  const systolic = Math.round(112 + (ageFactor * 0.45) + (bpm > 80 ? 4 : 0));
  const diastolic = Math.round(72 + (ageFactor * 0.22));
  const respiratoryRate = 14 + (ageYears % 4);

  // Clinical risk assessment
  const statusNotes: string[] = [];
  let status: 'NORMAL' | 'ELEVATED' | 'ATTENTION_REQUIRED' = 'NORMAL';

  if (bpm > 95) {
    statusNotes.push('Mild Tachycardia detected');
    status = 'ELEVATED';
  } else if (bpm < 60) {
    statusNotes.push('Mild Bradycardia detected');
    status = 'ELEVATED';
  }

  if (spo2 < 94) {
    statusNotes.push('Marginal SpO2 saturation');
    status = 'ATTENTION_REQUIRED';
  }

  if (temperature >= 37.5) {
    statusNotes.push('Low grade pyrexia');
    if (status !== 'ATTENTION_REQUIRED') status = 'ELEVATED';
  }

  if (systolic >= 140 || diastolic >= 90) {
    statusNotes.push('Elevated resting blood pressure');
    if (status !== 'ATTENTION_REQUIRED') status = 'ELEVATED';
  }

  return {
    bpm,
    spo2,
    temperature,
    systolic,
    diastolic,
    respiratoryRate,
    status,
    statusNotes
  };
}

/**
 * Avatar HSL hue calculation derived deterministically from age.
 * Avoids generic or random stock photos.
 */
export function getPatientAvatarHue(ageYears: number): number {
  return (ageYears * 15 + 175) % 360;
}

export function getPatientAvatarColor(ageYears: number): { bg: string; border: string; text: string } {
  const hue = getPatientAvatarHue(ageYears);
  return {
    bg: `hsl(${hue}, 65%, 20%)`,
    border: `hsl(${hue}, 70%, 45%)`,
    text: `hsl(${hue}, 80%, 85%)`
  };
}
