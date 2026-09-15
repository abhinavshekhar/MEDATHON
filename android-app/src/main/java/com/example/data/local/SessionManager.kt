package com.example.data.local

import android.content.Context
import android.content.SharedPreferences
import com.example.data.model.LabRecord
import com.example.data.model.OPDVisit
import com.example.data.model.Patient
import com.example.data.model.Prescription
import com.example.data.model.VitalLog
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

class SessionManager(context: Context) {
  private val prefs: SharedPreferences =
    context.getSharedPreferences("medathon_patient_session", Context.MODE_PRIVATE)

  private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
  private val patientAdapter = moshi.adapter(Patient::class.java)

  companion object {
    private const val KEY_IS_LOGGED_IN = "is_logged_in"
    private const val KEY_PATIENT_ID = "patient_id"
    private const val KEY_PATIENT_NO = "patient_no"
    private const val KEY_PATIENT_MOBILE = "patient_mobile"
    private const val KEY_SERVER_URL = "server_url"
    private const val KEY_CACHED_PATIENT = "cached_patient"
    private const val KEY_DEMO_MODE = "demo_mode"
    const val DEFAULT_SERVER_URL = "https://medathon-ten.vercel.app/"
  }

  var isLoggedIn: Boolean
    get() = prefs.getBoolean(KEY_IS_LOGGED_IN, false)
    set(value) = prefs.edit().putBoolean(KEY_IS_LOGGED_IN, value).apply()

  var currentPatientId: String
    get() = prefs.getString(KEY_PATIENT_ID, "") ?: ""
    set(value) = prefs.edit().putString(KEY_PATIENT_ID, value).apply()

  var currentPatientNo: String
    get() = prefs.getString(KEY_PATIENT_NO, "") ?: ""
    set(value) = prefs.edit().putString(KEY_PATIENT_NO, value).apply()

  var currentPatientMobile: String
    get() = prefs.getString(KEY_PATIENT_MOBILE, "") ?: ""
    set(value) = prefs.edit().putString(KEY_PATIENT_MOBILE, value).apply()

  var serverUrl: String
    get() {
      val url = prefs.getString(KEY_SERVER_URL, DEFAULT_SERVER_URL) ?: DEFAULT_SERVER_URL
      return if (url.endsWith("/")) url else "$url/"
    }
    set(value) {
      val normalized = if (value.endsWith("/")) value else "$value/"
      prefs.edit().putString(KEY_SERVER_URL, normalized).apply()
    }

  var isDemoMode: Boolean
    get() = prefs.getBoolean(KEY_DEMO_MODE, false)
    set(value) = prefs.edit().putBoolean(KEY_DEMO_MODE, value).apply()

  fun savePatient(patient: Patient) {
    try {
      val json = patientAdapter.toJson(patient)
      prefs.edit()
        .putString(KEY_CACHED_PATIENT, json)
        .putString(KEY_PATIENT_ID, patient.id)
        .putString(KEY_PATIENT_NO, patient.patientNo)
        .putString(KEY_PATIENT_MOBILE, patient.mobile)
        .putBoolean(KEY_IS_LOGGED_IN, true)
        .apply()
    } catch (_: Exception) {}
  }

  fun getCachedPatient(): Patient? {
    val json = prefs.getString(KEY_CACHED_PATIENT, null) ?: return null
    return try {
      patientAdapter.fromJson(json)
    } catch (_: Exception) {
      null
    }
  }

  fun clearSession() {
    val currentUrl = serverUrl
    prefs.edit()
      .remove(KEY_IS_LOGGED_IN)
      .remove(KEY_PATIENT_ID)
      .remove(KEY_PATIENT_NO)
      .remove(KEY_PATIENT_MOBILE)
      .remove(KEY_CACHED_PATIENT)
      .apply()
    serverUrl = currentUrl
  }
}

object ChennaiSeedData {
  val defaultPatient = Patient(
    id = "cm0915priyachennai01",
    patientNo = "P-CHN-20260915-0001",
    firstName = "Priya",
    lastName = "Subramanian",
    ageYears = 28,
    gender = "FEMALE",
    mobile = "9876543210",
    district = "Chennai",
    state = "Tamil Nadu",
    address = "Ward 42, T Nagar, Chennai, Tamil Nadu — 600017",
    opdType = "General OPD",
    doctorName = "Dr. Priya Subramanian",
    abha = "priya.subramanian@abdm",
    aadharMasked = "XXXX XXXX 8492",
    scheme = "PMJAY / TN CMCHIS",
    registeredAt = "2026-09-15 09:15 AM",
    visits = listOf(
      OPDVisit(
        id = "visit-001",
        patientId = "cm0915priyachennai01",
        date = "Today, 10:30 AM",
        opdType = "General OPD",
        doctorName = "Dr. Priya Subramanian",
        reason = "Routine vitals checkup & seasonal wellness",
        status = "WITH_DOCTOR",
        tokenNo = 14
      ),
      OPDVisit(
        id = "visit-002",
        patientId = "cm0915priyachennai01",
        date = "01 Sep 2026, 04:00 PM",
        opdType = "Cardiology OPD",
        doctorName = "Dr. Karthik Iyer",
        reason = "Post-workout BP baseline review",
        status = "COMPLETED",
        tokenNo = 8
      ),
      OPDVisit(
        id = "visit-003",
        patientId = "cm0915priyachennai01",
        date = "15 Aug 2026, 11:15 AM",
        opdType = "Dermatology",
        doctorName = "Dr. Malini Krishnan",
        reason = "Skin allergy consultation",
        status = "COMPLETED",
        tokenNo = 21
      )
    ),
    vitals = listOf(
      VitalLog(
        id = "vit-001",
        patientId = "cm0915priyachennai01",
        timestamp = "Today, 10:25 AM",
        heartRate = 74,
        spo2 = 98,
        temperature = 98.4,
        bpSystolic = 120,
        bpDiastolic = 80,
        respiratoryRate = 16,
        source = "Captured at reception kiosk",
        status = "Normal"
      ),
      VitalLog(
        id = "vit-002",
        patientId = "cm0915priyachennai01",
        timestamp = "01 Sep 2026, 03:55 PM",
        heartRate = 78,
        spo2 = 99,
        temperature = 98.6,
        bpSystolic = 122,
        bpDiastolic = 82,
        respiratoryRate = 17,
        source = "Captured at reception kiosk",
        status = "Normal"
      ),
      VitalLog(
        id = "vit-003",
        patientId = "cm0915priyachennai01",
        timestamp = "15 Aug 2026, 11:05 AM",
        heartRate = 72,
        spo2 = 98,
        temperature = 98.2,
        bpSystolic = 118,
        bpDiastolic = 78,
        respiratoryRate = 15,
        source = "Captured at reception kiosk",
        status = "Normal"
      )
    ),
    labRecords = listOf(
      LabRecord(
        id = "lab-001",
        patientId = "cm0915priyachennai01",
        testName = "Complete Blood Count (CBC)",
        date = "01 Sep 2026",
        result = "Hemoglobin: 13.8 g/dL (Normal)",
        unit = "g/dL",
        referenceRange = "12.0 - 15.5 g/dL",
        status = "Normal",
        doctorNotes = "All blood counts within optimal limits."
      ),
      LabRecord(
        id = "lab-002",
        patientId = "cm0915priyachennai01",
        testName = "Fasting Blood Glucose",
        date = "01 Sep 2026",
        result = "92 mg/dL",
        unit = "mg/dL",
        referenceRange = "70 - 99 mg/dL",
        status = "Normal",
        doctorNotes = "Normoglycemic fasting index."
      ),
      LabRecord(
        id = "lab-003",
        patientId = "cm0915priyachennai01",
        testName = "Lipid Profile (Total Cholesterol)",
        date = "15 Aug 2026",
        result = "168 mg/dL",
        unit = "mg/dL",
        referenceRange = "< 200 mg/dL",
        status = "Normal",
        doctorNotes = "Good cardiovascular profile."
      )
    ),
    prescriptions = listOf(
      Prescription(
        id = "rx-001",
        patientId = "cm0915priyachennai01",
        doctorName = "Dr. Priya Subramanian",
        date = "Today",
        medication = "Paracetamol 500mg",
        dosage = "1 - 0 - 1 (After food)",
        duration = "3 days",
        instructions = "Take with water if body aches or mild fever occurs."
      ),
      Prescription(
        id = "rx-002",
        patientId = "cm0915priyachennai01",
        doctorName = "Dr. Karthik Iyer",
        date = "01 Sep 2026",
        medication = "Vitamin D3 60,000 IU",
        dosage = "1 tablet weekly",
        duration = "4 weeks",
        instructions = "Take after breakfast with milk."
      ),
      Prescription(
        id = "rx-003",
        patientId = "cm0915priyachennai01",
        doctorName = "Dr. Malini Krishnan",
        date = "15 Aug 2026",
        medication = "Cetirizine 10mg",
        dosage = "0 - 0 - 1 (At bedtime)",
        duration = "5 days",
        instructions = "Avoid operating heavy machinery."
      )
    )
  )

  val chennaiDoctors = listOf(
    "Dr. Priya Subramanian (MBBS, MD - General Medicine)",
    "Dr. Karthik Iyer (MBBS, DM - Cardiology)",
    "Dr. Ananya Sundaram (MBBS, MS - Orthopaedics)",
    "Dr. R. Venkatesh (MBBS, DCH - Paediatrics)",
    "Dr. Malini Krishnan (MBBS, MD - Dermatology)",
    "Dr. S. Balasubramaniam (MBBS, MS - ENT)"
  )

  val chennaiLocalities = listOf(
    "T Nagar",
    "Anna Nagar",
    "Adyar",
    "Velachery",
    "Tambaram",
    "Mylapore",
    "Guindy",
    "Nungambakkam",
    "Besant Nagar",
    "Porur",
    "Chromepet",
    "Thiruvanmiyur"
  )

  val opdTypes = listOf(
    "General OPD",
    "Cardiology",
    "Orthopaedics",
    "Paediatrics",
    "Dermatology",
    "ENT / Ophthalmology"
  )
}
