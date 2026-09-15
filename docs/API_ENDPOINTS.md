# BHAVYA HIMS — API Endpoints (Discovered)

> Extracted from inline JavaScript on `patientRegistrationOPD.php` and related pages.
> Use as reference for rebuilding backend services.

## Core AJAX Endpoints

### `ajaxEhr.php` (sFlag-based routing)

| sFlag | Purpose |
|-------|---------|
| `GetAllClinicList` | List health facilities/clinics |
| `GetAllServiceTypes` | Service type categories |
| `GetServicesForServiceTypeCategoryID` | Services under a category |
| `GetChannelListChannelTypeID` | Channel/referral sources |
| `SearchPatientForName` | Patient name autocomplete |
| `getDuplicatePatientList` | Duplicate detection |
| `getPatientIdByPatientNumber` | Lookup by patient number |
| `getPatientDataForPatientID` | Full patient record fetch |
| `cancelRecommendation` | Cancel OPD recommendation |

### `ajaxIPDManager.php`

| sFlag | Purpose |
|-------|---------|
| `getAllClinicsByClinicName` | Clinic search |
| `fGetRecommendationNotes` | OPD recommendation notes |

### Other PHP Endpoints

| Endpoint | Purpose |
|----------|---------|
| `ajaxNDHB.php` | ABHA/NDHM operations |
| `ajaxGetRegisteredPatientOPD.php` | Today's OPD registrations |
| `addPatientEmulator.php?bAppRequest=1` | Create patient |
| `updatePatientEmulator.php?bAppRequest=1` | Update patient |
| `addScheduleEmulator.php` | Schedule OPD visit |
| `runTimeSession.php` | Session management |

## REST API v2 (`apiv2/`)

| Endpoint | Purpose |
|----------|---------|
| `apiv2/bhavya-patient-search/` | Advanced patient search |
| `apiv2/patient-abha` | ABHA patient linking |
| `apiv2/patients` | Patient CRUD |
| `apiv2/patient-search` | Patient search |

## NDHM/ABDM API (`api/ndhb/`)

| Endpoint | Purpose |
|----------|---------|
| `api/ndhb/patients/` | NDHM patient records |
| `api/ndhb/v3/patients/` | NDHM v3 patient API |
| `api/ndhb/v3/health-ids/profile/account/abha/search` | ABHA search |
| `api/ndhb/v3/health-ids/profile/login/request/otp` | ABHA OTP request |
| `api/ndhb/v3/health-ids/profile/login/verify` | ABHA OTP verify |
| `api/ndhb/v3/health-ids/aadhaar/mobile/update` | Aadhaar mobile update |
| `api/ndhb/v3/health-ids/aadhaar/mobile/verifyOTP` | Mobile OTP verify |
| `api/ndhb/v3/health-ids/aadhaar/suggestion/` | ABHA address suggestions |
| `api/ndhb/v3/health-ids/aadhaar/abha-address/profile` | ABHA profile |
| `api/ndhb/v3/health-ids/aadhaar/abha-address/get-card` | ABHA card download |

## Auth Pattern

```javascript
// AJAX requests use session-based auth headers
function getAjaxAuthHeaders() {
  return { /* session token from sessionStorage */ };
}
$.ajaxSetup({
  data: { /* CSRF/session fields */ },
  headers: getAjaxAuthHeaders(),
  statusCode: { 401: () => window.location.href = loginUrl }
});
```

## Rebuild Recommendation

Replace monolithic `ajaxEhr.php?sFlag=...` with RESTful routes:

```
GET    /api/v1/patients/search?q=
POST   /api/v1/patients
GET    /api/v1/patients/:id
PUT    /api/v1/patients/:id
POST   /api/v1/opd/registrations
GET    /api/v1/clinics
GET    /api/v1/services
POST   /api/v1/abha/link
GET    /api/v1/abha/search
```
