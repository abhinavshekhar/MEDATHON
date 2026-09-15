export type ModuleKind =
  | "queue"
  | "registration"
  | "workspace"
  | "analytics"
  | "monitor"
  | "tool";

export type ModuleDef = {
  path: string;
  title: string;
  description: string;
  kind: ModuleKind;
  opdType?: string;
  labStatuses?: string[];
  prescriptionStatus?: string;
  registrationHref?: string;
};

export const MODULE_CONFIG: Record<string, ModuleDef> = {
  "abha/profiles": {
    path: "abha/profiles",
    title: "Shared Health ID Profiles",
    description: "ABHA-linked patient profiles and consent-based record sharing",
    kind: "workspace",
  },
  "mch/registration": {
    path: "mch/registration",
    title: "MCH Registration",
    description: "Maternal and child health outpatient registrations",
    kind: "registration",
    opdType: "MCH",
    registrationHref: "/opd/registration",
  },
  "pediatric/registration": {
    path: "pediatric/registration",
    title: "Pediatric Registration",
    description: "Pediatric outpatient intake and visit scheduling",
    kind: "registration",
    opdType: "Pediatric",
    registrationHref: "/opd/registration",
  },
  "ae/registration": {
    path: "ae/registration",
    title: "A & E Registration",
    description: "Accident and emergency admissions with triage priority",
    kind: "registration",
    opdType: "Emergency",
    registrationHref: "/opd/registration",
  },
  "ae/queue": {
    path: "ae/queue",
    title: "A & E Queue",
    description: "Live emergency department queue and triage status",
    kind: "queue",
    opdType: "Emergency",
  },
  pharmacy: {
    path: "pharmacy",
    title: "Pharmacy Workspace",
    description: "Pending prescriptions awaiting dispensing review",
    kind: "workspace",
    prescriptionStatus: "PENDING",
  },
  "pharmacy/dispense": {
    path: "pharmacy/dispense",
    title: "Drug Dispense",
    description: "Dispense medicines, verify stock, and record billing",
    kind: "workspace",
    prescriptionStatus: "PENDING",
  },
  lab: {
    path: "lab",
    title: "Lab Workspace",
    description: "Sample collection queue and test processing pipeline",
    kind: "workspace",
    labStatuses: ["ORDERED", "COLLECTED"],
  },
  "lab/verification": {
    path: "lab/verification",
    title: "Lab Verification",
    description: "Results pending pathologist verification and sign-off",
    kind: "workspace",
    labStatuses: ["PROCESSING"],
  },
  "lab/reports": {
    path: "lab/reports",
    title: "Lab Reports",
    description: "Verified reports ready for dispatch to clinicians",
    kind: "workspace",
    labStatuses: ["VERIFIED", "DISPATCHED"],
  },
  "lab/dengue": {
    path: "lab/dengue",
    title: "Disease Reporting",
    description: "Notifiable disease surveillance and dengue case reporting",
    kind: "workspace",
    labStatuses: ["VERIFIED", "DISPATCHED"],
  },
  radiology: {
    path: "radiology",
    title: "Radiology Registration",
    description: "Imaging orders and modality scheduling",
    kind: "queue",
  },
  ecg: {
    path: "ecg",
    title: "ECG Workspace",
    description: "Electrocardiogram capture queue and interpretation",
    kind: "workspace",
  },
  inventory: {
    path: "inventory",
    title: "Inventory Management",
    description: "Medicine stock levels, batches, and reorder alerts",
    kind: "workspace",
  },
  "admin/roster": {
    path: "admin/roster",
    title: "Roster Management",
    description: "Doctor shifts, room assignments, and OPD coverage",
    kind: "workspace",
  },
  mis: {
    path: "mis",
    title: "MIS Dashboard",
    description: "Management information and operational analytics",
    kind: "analytics",
  },
  "smart-clinic/radiology": {
    path: "smart-clinic/radiology",
    title: "AI Radiology",
    description: "Chest X-ray upload with DenseNet121 Grad-CAM heatmap analysis",
    kind: "tool",
  },
  "smart-clinic/id-scanner": {
    path: "smart-clinic/id-scanner",
    title: "Aadhaar ID PDF",
    description: "Browse ID dataset, create sample cards, and download PDFs",
    kind: "tool",
  },
};

export function getModuleConfig(slug: string): ModuleDef | null {
  return MODULE_CONFIG[slug] ?? null;
}

export function getModulePath(slug: string[]) {
  return slug.join("/");
}
