# BHAVYA HIMS — Complete Module Map (Extracted)

> Source: `hims-aphc.bhavyabiharhealth.in` | Facility: APHC Mordiva Samastipur (HFR ID: IN1010007274)
> Extracted for rebuild with new UI/UX, branding, and AI features.

## System Overview

| Property | Value |
|----------|-------|
| Platform | MediXcel™ (Plus91 Technologies) |
| State | Bihar Health Department |
| Auth | Username/password + OTP (mobile) |
| Tech Stack (legacy) | PHP pages, jQuery, Select2, AJAX (`ajaxEhr.php`, `apiv2/`, `api/ndhb/`) |
| ABHA Integration | ABDM/NDHM health ID linking |

---

## Navigation Structure (All Modules)

### OPD
| Module | URL |
|--------|-----|
| Patient Registration | `/patientRegistrationOPD.php` |
| Shared ABHA Profiles | `/abdmProfile.php` |

### Patient Management
| Module | URL |
|--------|-----|
| Patient Records | `/PatientRecords.php` |

### MCH (Maternal & Child Health)
| Module | URL |
|--------|-----|
| MCH Registration | `/MCHPatientRegistration.php` |

### Pediatric
| Module | URL |
|--------|-----|
| Pediatric Registration | `/PediatricPatientRegistration.php` |

### Accident & Emergency
| Module | URL |
|--------|-----|
| A & E Registration | `/AEPatientRegistration.php` |
| A & E Queue | `/accidentEmergencyQueueNew.php` |
| Observation Station | `/ipdObservationStation.php` |
| Referred Patient Queue | `/ipdReferredPatient.php` |
| Dead Patient Queue | `/ipdBroughtDeadPatient.php` |
| Discharged Patient Queue | `/dischargePatientQueueAE.php` |

### Pharmacy
| Module | URL |
|--------|-----|
| Pharmacy Workspace | `/pharmacyQueue.php` |
| Drug Dispense | `/drugDispensev2.php` |
| Drug Dispense Reports | `/DrugDispenseReportNew.php` |
| Management | `/pharmacyManagementNew.php` |

### Lab (Pathology)
| Module | URL |
|--------|-----|
| Pathology Patient Registration | `/pathologyPatientRegistration.php` |
| Lab Workspace | `/labQueue.php` |
| Lab Verification Workspace | `/labQueue_verification.php` |
| Lab Report Workspace | `/reportDispatchedNew.php` |
| Dengue Reporting | `/reportDengueLinelist.php` |

### Radiology
| Module | URL |
|--------|-----|
| Radiology Patient Registration | `/radiologyPatientRegistration.php` |

### Electrocardiogram
| Module | URL |
|--------|-----|
| ECG Patient Registration | `/ElectrocardiogramPatientRegistration.php` |
| ECG Workspace | `/electrocardiogramQueue.php` |

### Inventory Management
| Module | URL |
|--------|-----|
| Add Unit Request | `/invViewUnitRequests.php` |
| Fulfilled Unit Request | `/invViewFulfilledRequestsV2.php` |
| Medicine Bulk Upload | `/bulkUploadMedicines.php` |

### Administration
| Module | URL |
|--------|-----|
| Roster Management | `/rosterManagement.php` |
| Department Room Management | `/deptRoomMangement.php` |

### MIS
| Module | URL |
|--------|-----|
| MIS Dashboard | `/MISDashboard.php` |

### Support
| Module | URL |
|--------|-----|
| Help, Support & Feedback | `/support.php` |
| User Profile | `/viewUserDetails.php` |
| Logout | `/Logout.php` |

---

## User Roles (Observed)

- Data entry operator
- (Additional roles likely: Doctor, Lab Technician, Pharmacist, Admin — role-based menu visibility)

---

## Cross-Cutting Features

1. **ABHA/ABDM Integration** — Create ABHA, link profile, shared profiles
2. **Patient Search** — Name, Patient No, Visit ID, Mobile, Email
3. **Government Schemes** — PMJAY, RBSK, NCD/CBAC, HBNC, BPL, PMSMA, FPOT, FP, HBYC
4. **MLC (Medico Legal Case)** — Full MLC workflow with FIR, consent, document upload
5. **Payment Collection** — Fee structure, OPD fees
6. **Keyboard Shortcuts** — Power-user navigation
7. **Doctor Roster** — Scheduling integration
