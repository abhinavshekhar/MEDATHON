import { Patient } from '../types';

export const CHENNAI_PATIENTS: Patient[] = [
  {
    id: 'clx001_priya_subramanian',
    patientNo: 'P-CHN-20260915-0001',
    name: 'Priya Subramanian',
    ageYears: 28,
    gender: 'FEMALE',
    district: 'Chennai (T. Nagar)',
    state: 'Tamil Nadu',
    abhaAddress: 'priya.subramanian@abdm',
    phoneNumber: '+91 98401 23456',
    bloodGroup: 'B+',
    visits: [
      {
        id: 'vis_chn_001',
        visitId: 'V-CHN-20260915-0104',
        opdType: 'General OPD',
        status: 'REGISTERED',
        tokenNo: 14,
        registeredAt: '2026-09-15T08:30:00.000Z'
      }
    ],
    vitalLogs: []
  },
  {
    id: 'clx002_karthik_selvam',
    patientNo: 'P-CHN-20260915-0002',
    name: 'Karthik Selvam',
    ageYears: 42,
    gender: 'MALE',
    district: 'Chennai (Mylapore)',
    state: 'Tamil Nadu',
    abhaAddress: 'karthik.selvam@abdm',
    phoneNumber: '+91 94440 98765',
    bloodGroup: 'O+',
    visits: [
      {
        id: 'vis_chn_002',
        visitId: 'V-CHN-20260915-0105',
        opdType: 'Cardiology OPD',
        status: 'REGISTERED',
        tokenNo: 15,
        registeredAt: '2026-09-15T08:45:00.000Z'
      }
    ],
    vitalLogs: []
  },
  {
    id: 'clx003_meenakshi_sundaram',
    patientNo: 'P-CHN-20260915-0003',
    name: 'Meenakshi Sundaram',
    ageYears: 64,
    gender: 'FEMALE',
    district: 'Chennai (Velachery)',
    state: 'Tamil Nadu',
    abhaAddress: 'meenakshi.s@abdm',
    phoneNumber: '+91 98840 55432',
    bloodGroup: 'A+',
    visits: [
      {
        id: 'vis_chn_003',
        visitId: 'V-CHN-20260915-0106',
        opdType: 'Diabetology OPD',
        status: 'REGISTERED',
        tokenNo: 16,
        registeredAt: '2026-09-15T09:00:00.000Z'
      }
    ],
    vitalLogs: []
  },
  {
    id: 'clx004_ananya_natarajan',
    patientNo: 'P-CHN-20260915-0004',
    name: 'Ananya Natarajan',
    ageYears: 19,
    gender: 'FEMALE',
    district: 'Chennai (Anna Nagar)',
    state: 'Tamil Nadu',
    abhaAddress: 'ananya.n@abdm',
    phoneNumber: '+91 97909 11223',
    bloodGroup: 'O-',
    visits: [
      {
        id: 'vis_chn_004',
        visitId: 'V-CHN-20260915-0107',
        opdType: 'Dermatology OPD',
        status: 'REGISTERED',
        tokenNo: 17,
        registeredAt: '2026-09-15T09:15:00.000Z'
      }
    ],
    vitalLogs: []
  },
  {
    id: 'clx005_murugan_k',
    patientNo: 'P-CHN-20260915-0005',
    name: 'Murugan K.',
    ageYears: 55,
    gender: 'MALE',
    district: 'Chennai (Royapettah)',
    state: 'Tamil Nadu',
    abhaAddress: 'murugan.k@abdm',
    phoneNumber: '+91 98410 77889',
    bloodGroup: 'AB+',
    visits: [
      {
        id: 'vis_chn_005',
        visitId: 'V-CHN-20260915-0108',
        opdType: 'Orthopedic OPD',
        status: 'REGISTERED',
        tokenNo: 18,
        registeredAt: '2026-09-15T09:30:00.000Z'
      }
    ],
    vitalLogs: []
  },
  {
    id: 'clx006_ramanathan_r',
    patientNo: 'P-CHN-20260915-0006',
    name: 'Dr. R. Ramanathan',
    ageYears: 71,
    gender: 'MALE',
    district: 'Chennai (Adyar)',
    state: 'Tamil Nadu',
    abhaAddress: 'ramanathan.r@abdm',
    phoneNumber: '+91 94441 33445',
    bloodGroup: 'A-',
    visits: [
      {
        id: 'vis_chn_006',
        visitId: 'V-CHN-20260915-0109',
        opdType: 'Geriatric OPD',
        status: 'REGISTERED',
        tokenNo: 19,
        registeredAt: '2026-09-15T09:40:00.000Z'
      }
    ],
    vitalLogs: []
  },
  {
    id: 'clx007_deepa_venkatesh',
    patientNo: 'P-CHN-20260915-0007',
    name: 'Deepa Venkatesh',
    ageYears: 34,
    gender: 'FEMALE',
    district: 'Chennai (Tambaram)',
    state: 'Tamil Nadu',
    abhaAddress: 'deepa.v@abdm',
    phoneNumber: '+91 98402 99881',
    bloodGroup: 'B-',
    visits: [
      {
        id: 'vis_chn_007',
        visitId: 'V-CHN-20260915-0110',
        opdType: 'ENT OPD',
        status: 'REGISTERED',
        tokenNo: 20,
        registeredAt: '2026-09-15T09:50:00.000Z'
      }
    ],
    vitalLogs: []
  },
  {
    id: 'clx008_senthil_kumar',
    patientNo: 'P-CHN-20260915-0008',
    name: 'Senthil Kumar',
    ageYears: 38,
    gender: 'MALE',
    district: 'Chennai (Guindy)',
    state: 'Tamil Nadu',
    abhaAddress: 'senthil.kumar@abdm',
    phoneNumber: '+91 97910 44556',
    bloodGroup: 'O+',
    visits: [
      {
        id: 'vis_chn_008',
        visitId: 'V-CHN-20260915-0111',
        opdType: 'General Medicine',
        status: 'REGISTERED',
        tokenNo: 21,
        registeredAt: '2026-09-15T10:00:00.000Z'
      }
    ],
    vitalLogs: []
  }
];

// In-memory patient store that can dynamically generate or lookup
const patientDatabase = new Map<string, Patient>();

// Initialize with baseline Chennai patients
CHENNAI_PATIENTS.forEach(p => {
  patientDatabase.set(p.patientNo.toUpperCase(), p);
  patientDatabase.set(p.id, p);
});

// Shared in-memory vitals log store for the Digital Twin
export const vitalsDatabase: Patient['vitalLogs'] = [];

export function findPatientByNumber(patientNo: string): Patient | null {
  const clean = patientNo.trim().toUpperCase();
  if (patientDatabase.has(clean)) {
    return patientDatabase.get(clean)!;
  }

  // Also check substring matching or patientId matching
  for (const patient of patientDatabase.values()) {
    if (patient.patientNo.toUpperCase() === clean || patient.id === patientNo) {
      return patient;
    }
  }

  // If matches valid Chennai pattern P-CHN-*, create deterministic patient
  if (/^P-CHN-\d{8}-\d{4}$/i.test(clean)) {
    const seq = parseInt(clean.slice(-4), 10) || 1;
    const names = [
      { name: 'Kavitha Balasubramanian', gender: 'FEMALE' as const, age: 31, dist: 'Chennai (Mylapore)' },
      { name: 'Rajeshwaran V.', gender: 'MALE' as const, age: 48, dist: 'Chennai (T. Nagar)' },
      { name: 'Shanthi Narayanan', gender: 'FEMALE' as const, age: 62, dist: 'Chennai (Adyar)' },
      { name: 'Saravanan S.', gender: 'MALE' as const, age: 26, dist: 'Chennai (Velachery)' },
      { name: 'Gayathri Raghavan', gender: 'FEMALE' as const, age: 39, dist: 'Chennai (Anna Nagar)' },
    ];
    const picked = names[seq % names.length];
    const newPatient: Patient = {
      id: `clx_${seq}_${clean.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      patientNo: clean,
      name: picked.name,
      ageYears: picked.age,
      gender: picked.gender,
      district: picked.dist,
      state: 'Tamil Nadu',
      abhaAddress: `${picked.name.toLowerCase().split(' ')[0]}.${seq}@abdm`,
      phoneNumber: `+91 9840${String(seq).padStart(6, '0').slice(-6)}`,
      visits: [
        {
          id: `vis_${seq}`,
          visitId: `V-CHN-20260915-${String(seq + 100).padStart(4, '0')}`,
          opdType: 'General OPD',
          status: 'REGISTERED',
          tokenNo: (seq % 40) + 1
        }
      ],
      vitalLogs: []
    };
    patientDatabase.set(clean, newPatient);
    return newPatient;
  }

  return null;
}

export function getAllPatients(): Patient[] {
  return CHENNAI_PATIENTS;
}
