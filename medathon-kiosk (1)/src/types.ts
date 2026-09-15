export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type VisitStatus = 'REGISTERED' | 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED';

export interface Visit {
  id: string;
  visitId: string;
  opdType: string;
  status: VisitStatus;
  tokenNo?: number;
  registeredAt?: string;
}

export interface VitalLog {
  id: string;
  patientId: string;
  patientNo?: string;
  visitId?: string;
  bpm: number;
  spo2: number;
  temperature: number;
  systolic?: number;
  diastolic?: number;
  respiratoryRate?: number;
  deviceId?: string;
  recordedAt: string;
  status?: 'NORMAL' | 'ELEVATED' | 'ATTENTION_REQUIRED';
}

export interface Patient {
  id: string;
  patientNo: string;
  name: string;
  ageYears: number;
  gender: Gender;
  district: string;
  state: string;
  abhaAddress?: string;
  phoneNumber?: string;
  bloodGroup?: string;
  visits: Visit[];
  vitalLogs: VitalLog[];
}

export interface PatientQrPayload {
  type: 'medathon-patient';
  patientNo: string;
  patientId?: string;
  name?: string;
  abha?: string;
}

export type KioskScreenState = 
  | 'ATTRACT'       // State 1: Attract / Welcome
  | 'SCANNER'       // State 2: QR Scanner
  | 'CONFIRMATION'  // State 3: Patient Profile Confirmation
  | 'CAPTURING'     // State 4: Vitals Capture (Animated Hospital Monitor)
  | 'SUCCESS_SYNC'; // State 5: Success + Sync to Digital Twin

export type KioskLanguage = 'en' | 'ta';
