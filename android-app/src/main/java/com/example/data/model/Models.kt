package com.example.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Patient(
  @Json(name = "id") val id: String,
  @Json(name = "patientNo") val patientNo: String,
  @Json(name = "firstName") val firstName: String,
  @Json(name = "lastName") val lastName: String,
  @Json(name = "ageYears") val ageYears: Int,
  @Json(name = "gender") val gender: String, // "MALE" or "FEMALE"
  @Json(name = "mobile") val mobile: String,
  @Json(name = "district") val district: String = "Chennai",
  @Json(name = "state") val state: String = "Tamil Nadu",
  @Json(name = "address") val address: String,
  @Json(name = "opdType") val opdType: String? = null,
  @Json(name = "doctorName") val doctorName: String? = null,
  @Json(name = "abha") val abha: String? = null,
  @Json(name = "aadharMasked") val aadharMasked: String? = "XXXX XXXX 8492",
  @Json(name = "scheme") val scheme: String? = "PMJAY",
  @Json(name = "registeredAt") val registeredAt: String? = null,
  @Json(name = "visits") val visits: List<OPDVisit>? = emptyList(),
  @Json(name = "vitals") val vitals: List<VitalLog>? = emptyList(),
  @Json(name = "labRecords") val labRecords: List<LabRecord>? = emptyList(),
  @Json(name = "prescriptions") val prescriptions: List<Prescription>? = emptyList()
) {
  val fullName: String
    get() = "$firstName $lastName".trim()

  val abhaAddress: String
    get() = abha ?: "${firstName.lowercase().replace(" ", "")}.${lastName.lowercase().replace(" ", "")}@abdm"
}

@JsonClass(generateAdapter = true)
data class RegisterPatientRequest(
  @Json(name = "firstName") val firstName: String,
  @Json(name = "lastName") val lastName: String,
  @Json(name = "ageYears") val ageYears: Int,
  @Json(name = "gender") val gender: String, // "MALE" or "FEMALE"
  @Json(name = "mobile") val mobile: String,
  @Json(name = "district") val district: String = "Chennai",
  @Json(name = "state") val state: String = "Tamil Nadu",
  @Json(name = "address") val address: String,
  @Json(name = "opdType") val opdType: String,
  @Json(name = "doctorName") val doctorName: String,
  @Json(name = "referredBy") val referredBy: String = "Self / Walk-in",
  @Json(name = "reason") val reason: String = "Routine checkup",
  @Json(name = "feeAmount") val feeAmount: Int = 0,
  @Json(name = "paymentCollected") val paymentCollected: Boolean = true
)

@JsonClass(generateAdapter = true)
data class VitalLog(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "timestamp") val timestamp: String,
  @Json(name = "heartRate") val heartRate: Int, // BPM
  @Json(name = "spo2") val spo2: Int, // %
  @Json(name = "temperature") val temperature: Double, // °F
  @Json(name = "bpSystolic") val bpSystolic: Int = 120,
  @Json(name = "bpDiastolic") val bpDiastolic: Int = 80,
  @Json(name = "respiratoryRate") val respiratoryRate: Int = 16,
  @Json(name = "source") val source: String = "Captured at reception kiosk",
  @Json(name = "status") val status: String = "Normal"
)

@JsonClass(generateAdapter = true)
data class OPDVisit(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "date") val date: String,
  @Json(name = "opdType") val opdType: String,
  @Json(name = "doctorName") val doctorName: String,
  @Json(name = "reason") val reason: String,
  @Json(name = "status") val status: String, // REGISTERED, IN_QUEUE, WITH_DOCTOR, COMPLETED
  @Json(name = "tokenNo") val tokenNo: Int? = null
)

@JsonClass(generateAdapter = true)
data class LabRecord(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "testName") val testName: String,
  @Json(name = "date") val date: String,
  @Json(name = "result") val result: String,
  @Json(name = "unit") val unit: String? = null,
  @Json(name = "referenceRange") val referenceRange: String? = null,
  @Json(name = "status") val status: String = "Normal", // Normal, Borderline, High
  @Json(name = "doctorNotes") val doctorNotes: String? = null
)

@JsonClass(generateAdapter = true)
data class Prescription(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "doctorName") val doctorName: String,
  @Json(name = "date") val date: String,
  @Json(name = "medication") val medication: String,
  @Json(name = "dosage") val dosage: String,
  @Json(name = "duration") val duration: String,
  @Json(name = "instructions") val instructions: String? = null
)

@JsonClass(generateAdapter = true)
data class AbdmQrPayload(
  @Json(name = "type") val type: String = "medathon-patient",
  @Json(name = "patientNo") val patientNo: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "name") val name: String,
  @Json(name = "abha") val abha: String
)
