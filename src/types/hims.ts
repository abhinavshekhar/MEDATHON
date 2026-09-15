/**
 * Core TypeScript types and navigation map for MEDATHON HIMS.
 * Entity shapes align with docs/DATA_MODELS/*.json and prisma/schema.prisma.
 */

export type Gender = "Male" | "Female";
export type MaritalStatus = "Single" | "Married" | "Divorced" | "Separated" | "Widow" | "Widower";

export interface Patient {
  id?: string;
  patientNo?: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  ageYears?: number;
  ageMonths?: number;
  ageDays?: number;
  dateOfBirth?: string;
  gender: Gender;
  maritalStatus?: MaritalStatus;
  fatherSpouseName?: string;
  ashaWorker?: string;
  bloodGroup?: string;
  religionCaste?: string;
  category?: string;
  email?: string;
  mobile?: string;
  aadhaarNo?: string;
  epicNo?: string;
  abhaAddress?: string;
  isDead?: boolean;
  address: PatientAddress;
  schemes: GovernmentSchemes;
  mlcDetails?: MLCDetails;
}

export interface PatientAddress {
  country?: string;
  state?: string;
  district?: string;
  block?: string;
  ward?: string;
  village?: string;
  panchayat?: string;
  postOffice?: string;
  policeStation?: string;
  pinCode?: string;
  address?: string;
}

export interface GovernmentSchemes {
  pmjay?: boolean;
  rbsk?: boolean;
  ncdCbca?: boolean;
  hbnc?: boolean;
  bpl?: boolean;
  pmsma?: boolean;
  fpot?: boolean;
  fp?: boolean;
  hbyc?: boolean;
  others?: boolean;
}

export interface OPDVisit {
  visitId?: string;
  patientId: string;
  clinicId: number;
  opdType: string;
  modalityType?: string;
  doctorId?: number;
  doctorName?: string;
  roomNo?: string;
  referredBy: string;
  reason: string;
  feeStructureId?: number;
  totalFee?: number;
  paymentCollected?: boolean;
  isMLC?: boolean;
  status?: "registered" | "in_queue" | "with_doctor" | "completed" | "cancelled";
}

export interface MLCDetails {
  mlcNo?: string;
  policeStation?: string;
  psiConstable?: string;
  firDate?: string;
  incidentDateTime?: string;
  mrdRegNo?: string;
  caseType?: string;
  consentTaken?: boolean;
  specialNotes?: string;
}

// ─── Project 2: Smart Clinic (IoT + AI) ─────────────────────

export interface VitalLog {
  id?: string;
  patientId: string;
  visitId?: string;
  kioskId?: string;
  bpm?: number;
  spo2?: number;
  temperature?: number;
  recordedAt?: string;
}

export interface Consultation {
  id?: string;
  visitId: string;
  aiSummary?: string;
  radiologyUrl?: string;
  aiHeatmapUrl?: string;
  diagnosis?: string;
  notes?: string;
}

export interface KioskDevice {
  id?: string;
  deviceId: string;
  name: string;
  clinicId: number;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface NavModule {
  id: string;
  label: string;
  href: string;
  icon: string;
  category: ModuleCategory;
}

export type ModuleCategory =
  | "OPD"
  | "Patient Management"
  | "MCH"
  | "Pediatric"
  | "Accident & Emergency"
  | "Pharmacy"
  | "Lab"
  | "Radiology"
  | "ECG"
  | "Inventory"
  | "Administration"
  | "MIS"
  | "Smart Clinic"
  | "Support";

export const HIMS_MODULES: NavModule[] = [
  { id: "patient-registration", label: "Patient Registration", href: "/opd/registration", icon: "UserPlus", category: "OPD" },
  { id: "abha-profiles", label: "Shared Health ID Profiles", href: "/abha/profiles", icon: "IdCard", category: "OPD" },
  { id: "patient-records", label: "Patient Records", href: "/patients", icon: "FolderOpen", category: "Patient Management" },
  { id: "mch-registration", label: "MCH Registration", href: "/mch/registration", icon: "Baby", category: "MCH" },
  { id: "pediatric-registration", label: "Pediatric Registration", href: "/pediatric/registration", icon: "Heart", category: "Pediatric" },
  { id: "ae-registration", label: "A & E Registration", href: "/ae/registration", icon: "Siren", category: "Accident & Emergency" },
  { id: "ae-queue", label: "A & E Queue", href: "/ae/queue", icon: "ListOrdered", category: "Accident & Emergency" },
  { id: "pharmacy-workspace", label: "Pharmacy Workspace", href: "/pharmacy", icon: "Pill", category: "Pharmacy" },
  { id: "drug-dispense", label: "Drug Dispense", href: "/pharmacy/dispense", icon: "Package", category: "Pharmacy" },
  { id: "lab-workspace", label: "Lab Workspace", href: "/lab", icon: "FlaskConical", category: "Lab" },
  { id: "lab-verification", label: "Lab Verification", href: "/lab/verification", icon: "CheckCircle", category: "Lab" },
  { id: "lab-reports", label: "Lab Reports", href: "/lab/reports", icon: "FileText", category: "Lab" },
  { id: "dengue-reporting", label: "Disease Reporting", href: "/lab/dengue", icon: "Bug", category: "Lab" },
  { id: "radiology", label: "Radiology Registration", href: "/radiology", icon: "Scan", category: "Radiology" },
  { id: "ecg", label: "ECG Workspace", href: "/ecg", icon: "Activity", category: "ECG" },
  { id: "inventory", label: "Inventory", href: "/inventory", icon: "Warehouse", category: "Inventory" },
  { id: "roster", label: "Roster Management", href: "/admin/roster", icon: "Calendar", category: "Administration" },
  { id: "mis", label: "MIS Dashboard", href: "/mis", icon: "BarChart3", category: "MIS" },
  { id: "vitals-kiosk", label: "Vitals Kiosk Monitor", href: "/smart-clinic/kiosk", icon: "HeartPulse", category: "Smart Clinic" },
  { id: "digital-twin", label: "Digital Twin Workspace", href: "/smart-clinic/digital-twin", icon: "Activity", category: "Smart Clinic" },
  { id: "ai-radiology", label: "AI Radiology", href: "/smart-clinic/radiology", icon: "Scan", category: "Smart Clinic" },
  { id: "id-scanner", label: "Aadhaar ID PDF", href: "/smart-clinic/id-scanner", icon: "ScanLine", category: "Smart Clinic" },
];
