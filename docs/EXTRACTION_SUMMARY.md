# BHAVYA HIMS — Full Extraction Summary

> All 10 core module pages extracted on 2026-09-06 from live system.
> Raw JSON: `scripts/extraction_output_utf8.json`  
> Structured page models: `docs/DATA_MODELS/pages/` (auto-generated via `scripts/generate_data_models.py`)

## Extraction Coverage

| # | Module | Fields | Tables | Status |
|---|--------|--------|--------|--------|
| 1 | Patient Records | 1 | 1 | ✅ |
| 2 | MCH Registration | 80+ | 4 | ✅ |
| 3 | Pharmacy Workspace | 5+ | 1 | ✅ |
| 4 | Lab Workspace | 15+ | 3 | ✅ |
| 5 | MIS Dashboard | 0 (AJAX) | 0 (dynamic) | ✅ |
| 6 | A & E Registration | 80+ | 3 | ✅ |
| 7 | Drug Dispense | 20+ | 5 | ✅ |
| 8 | Pathology Registration | 80+ | 4 | ✅ |
| 9 | ABDM Profile | 8+ | 2 | ✅ |
| 10 | Roster Management | 3 | 1 | ✅ |

## Shared Patient Entity (used across 5+ modules)

All registration pages share the same core patient form:
- **Demographics**: Name, Age (Y/M/D), DOB, Gender, Marital Status, Father/Spouse, ASHA Worker, Blood Group, Category
- **Address**: Country → State → District → Block → Village → Panchayat (cascading selects), Ward, Post Office, Police Station, Pin Code
- **Communications**: Email, Mobile
- **Identification**: Aadhaar, EPIC/Voter ID, ABHA Address
- **Schemes**: PMJAY, RBSK, NCD/CBAC, HBNC, BPL, PMSMA, FPOT, FP, HBYC, Others
- **MLC**: Optional medico-legal case details with document upload

## Queue Page Pattern (Pharmacy, Lab, A&E)

All queue pages follow this structure:
1. Date picker (`idQueueDate`)
2. Patient search filter
3. Status/category filter checkboxes
4. DataTable with action buttons
5. Modal dialogs for detail views

## Data Migration Path

To pull existing live data into your new system:

```bash
# 1. Login to main portal
POST https://hims.bhavyabiharhealth.in/doLogin.php
     { username, password }

# 2. Access facility
GET https://hims.bhavyabiharhealth.in/accessHIMS.php?sFacilityCode=SA-Y75

# 3. Fetch patients
GET https://hims-aphc.bhavyabiharhealth.in/apiv2/patients
GET https://hims-aphc.bhavyabiharhealth.in/apiv2/patient-search?q=...

# 4. Use extraction script for bulk page structure
python scripts/extract_hims_pages.py
```

## Re-extraction

Run anytime to refresh field data from live system:

```bash
pip install requests
python scripts/extract_hims_pages.py > scripts/extraction_output.json
python scripts/generate_data_models.py   # Regenerate docs/DATA_MODELS/pages/
```
