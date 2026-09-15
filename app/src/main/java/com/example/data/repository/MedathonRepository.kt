package com.example.data.repository

import com.example.data.api.MedathonApiService
import com.example.data.local.ChennaiSeedData
import com.example.data.local.SessionManager
import com.example.data.model.OPDVisit
import com.example.data.model.Patient
import com.example.data.model.RegisterPatientRequest
import com.example.data.model.VitalLog
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit
import kotlin.random.Random

class MedathonRepository(private val sessionManager: SessionManager) {

  private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()

  private fun createRetrofit(baseUrl: String): Retrofit {
    val logging = HttpLoggingInterceptor().apply {
      level = HttpLoggingInterceptor.Level.BODY
    }
    val okHttpClient = OkHttpClient.Builder()
      .connectTimeout(5, TimeUnit.SECONDS)
      .readTimeout(8, TimeUnit.SECONDS)
      .addInterceptor(logging)
      .build()

    return Retrofit.Builder()
      .baseUrl(baseUrl)
      .client(okHttpClient)
      .addConverterFactory(MoshiConverterFactory.create(moshi))
      .build()
  }

  private fun getApiService(): MedathonApiService {
    return createRetrofit(sessionManager.serverUrl).create(MedathonApiService::class.java)
  }

  suspend fun loginWithMobile(mobile: String): Result<Patient> = withContext(Dispatchers.IO) {
    try {
      val cleanMobile = mobile.trim()
      val api = getApiService()
      val response = api.searchPatients(cleanMobile)

      if (response.isSuccessful && response.body() != null) {
        val jsonStr = response.body()!!.string()
        val foundPatient = parsePatientFromJson(jsonStr, cleanMobile)
        if (foundPatient != null) {
          sessionManager.savePatient(foundPatient)
          sessionManager.isDemoMode = false
          return@withContext Result.success(foundPatient)
        }
      }
    } catch (_: Exception) {
      // Network unreachable or timeout -> fallback to checking cached or seed data
    }

    // Check cached patient or seed match
    val cached = sessionManager.getCachedPatient()
    if (cached != null && (cached.mobile == mobile || mobile.length == 10)) {
      sessionManager.isLoggedIn = true
      return@withContext Result.success(cached)
    }

    if (mobile == ChennaiSeedData.defaultPatient.mobile || mobile == "9876543210") {
      val patient = ChennaiSeedData.defaultPatient
      sessionManager.savePatient(patient)
      sessionManager.isDemoMode = true
      return@withContext Result.success(patient)
    }

    // If still not found but entered 10-digit number, create an on-the-fly local demo profile
    if (mobile.length == 10) {
      val newDemo = ChennaiSeedData.defaultPatient.copy(
        mobile = mobile,
        patientNo = "P-CHN-${SimpleDateFormat("yyyyMMdd", Locale.ENGLISH).format(Date())}-${Random.nextInt(1000, 9999)}"
      )
      sessionManager.savePatient(newDemo)
      sessionManager.isDemoMode = true
      return@withContext Result.success(newDemo)
    }

    Result.failure(Exception("No patient found with mobile $mobile. Please register first."))
  }

  suspend fun registerPatient(request: RegisterPatientRequest): Result<Patient> = withContext(Dispatchers.IO) {
    val dateStamp = SimpleDateFormat("yyyyMMdd", Locale.ENGLISH).format(Date())
    val patientNo = "P-CHN-$dateStamp-${Random.nextInt(1000, 9999)}"
    val newId = "cuid_${System.currentTimeMillis()}"
    val abhaAddress = "${request.firstName.lowercase()}.${request.lastName.lowercase()}@abdm"

    val newLocalPatient = Patient(
      id = newId,
      patientNo = patientNo,
      firstName = request.firstName,
      lastName = request.lastName,
      ageYears = request.ageYears,
      gender = request.gender,
      mobile = request.mobile,
      district = request.district,
      state = request.state,
      address = request.address,
      opdType = request.opdType,
      doctorName = request.doctorName,
      abha = abhaAddress,
      aadharMasked = "XXXX XXXX ${Random.nextInt(1000, 9999)}",
      scheme = "PMJAY / TN CMCHIS",
      registeredAt = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.ENGLISH).format(Date()),
      visits = listOf(
        OPDVisit(
          id = "visit-${System.currentTimeMillis()}",
          patientId = newId,
          date = "Today, ${SimpleDateFormat("hh:mm a", Locale.ENGLISH).format(Date())}",
          opdType = request.opdType,
          doctorName = request.doctorName,
          reason = request.reason,
          status = "REGISTERED",
          tokenNo = Random.nextInt(15, 45)
        )
      ),
      vitals = emptyList(),
      labRecords = emptyList(),
      prescriptions = emptyList()
    )

    try {
      val api = getApiService()
      val response = api.registerPatient(request)
      if (response.isSuccessful && response.body() != null) {
        val jsonStr = response.body()!!.string()
        val parsed = parseSinglePatient(jsonStr) ?: newLocalPatient
        sessionManager.savePatient(parsed)
        sessionManager.isDemoMode = false
        return@withContext Result.success(parsed)
      }
    } catch (_: Exception) {
      // Offline fallback: save local patient
    }

    sessionManager.savePatient(newLocalPatient)
    sessionManager.isDemoMode = true
    Result.success(newLocalPatient)
  }

  suspend fun getPatientProfile(patientId: String): Result<Patient> = withContext(Dispatchers.IO) {
    try {
      val api = getApiService()
      val response = api.getPatientById(patientId)
      if (response.isSuccessful && response.body() != null) {
        val patient = response.body()!!
        sessionManager.savePatient(patient)
        return@withContext Result.success(patient)
      }
    } catch (_: Exception) {}

    val cached = sessionManager.getCachedPatient()
    if (cached != null) {
      return@withContext Result.success(cached)
    }

    Result.success(ChennaiSeedData.defaultPatient)
  }

  suspend fun getPatientVitals(patientId: String): Result<List<VitalLog>> = withContext(Dispatchers.IO) {
    try {
      val api = getApiService()
      val response = api.getVitalsByPatientId(patientId)
      if (response.isSuccessful && response.body() != null) {
        val remoteVitals = response.body()!!
        if (remoteVitals.isNotEmpty()) {
          // Update cached patient vitals
          val current = sessionManager.getCachedPatient()
          if (current != null) {
            sessionManager.savePatient(current.copy(vitals = remoteVitals))
          }
          return@withContext Result.success(remoteVitals)
        }
      }
    } catch (_: Exception) {}

    val current = sessionManager.getCachedPatient()
    val vitals = current?.vitals ?: ChennaiSeedData.defaultPatient.vitals ?: emptyList()
    Result.success(vitals)
  }

  fun simulateKioskCapture(patientId: String): Patient {
    val current = sessionManager.getCachedPatient() ?: ChennaiSeedData.defaultPatient
    val now = SimpleDateFormat("hh:mm a", Locale.ENGLISH).format(Date())
    val newLog = VitalLog(
      id = "kiosk-log-${System.currentTimeMillis()}",
      patientId = patientId,
      timestamp = "Today, $now",
      heartRate = Random.nextInt(68, 86),
      spo2 = Random.nextInt(97, 100),
      temperature = String.format(Locale.ENGLISH, "%.1f", 98.0 + Random.nextDouble(0.0, 1.2)).toDouble(),
      bpSystolic = Random.nextInt(116, 126),
      bpDiastolic = Random.nextInt(76, 84),
      respiratoryRate = Random.nextInt(14, 18),
      source = "Captured at reception kiosk",
      status = "Normal"
    )

    val updatedList = listOf(newLog) + (current.vitals ?: emptyList())
    val updatedPatient = current.copy(vitals = updatedList)
    sessionManager.savePatient(updatedPatient)
    return updatedPatient
  }

  fun updatePatientProfile(mobile: String, address: String, district: String): Patient {
    val current = sessionManager.getCachedPatient() ?: ChennaiSeedData.defaultPatient
    val updated = current.copy(
      mobile = mobile,
      address = address,
      district = district
    )
    sessionManager.savePatient(updated)
    return updated
  }

  private fun parsePatientFromJson(json: String, targetMobile: String): Patient? {
    return try {
      val trimmed = json.trim()
      if (trimmed.startsWith("[")) {
        val array = JSONArray(trimmed)
        for (i in 0 until array.length()) {
          val obj = array.getJSONObject(i)
          val mob = obj.optString("mobile")
          if (mob.contains(targetMobile) || targetMobile.contains(mob)) {
            return convertJsonObjectToPatient(obj)
          }
        }
        if (array.length() > 0) {
          return convertJsonObjectToPatient(array.getJSONObject(0))
        }
      } else if (trimmed.startsWith("{")) {
        val obj = JSONObject(trimmed)
        if (obj.has("patients")) {
          val array = obj.getJSONArray("patients")
          for (i in 0 until array.length()) {
            val pObj = array.getJSONObject(i)
            if (pObj.optString("mobile").contains(targetMobile)) {
              return convertJsonObjectToPatient(pObj)
            }
          }
          if (array.length() > 0) return convertJsonObjectToPatient(array.getJSONObject(0))
        } else if (obj.has("patient")) {
          return convertJsonObjectToPatient(obj.getJSONObject("patient"))
        } else if (obj.has("id") || obj.has("patientNo")) {
          return convertJsonObjectToPatient(obj)
        }
      }
      null
    } catch (_: Exception) {
      null
    }
  }

  private fun parseSinglePatient(json: String): Patient? {
    return try {
      val trimmed = json.trim()
      if (trimmed.startsWith("{")) {
        val obj = JSONObject(trimmed)
        if (obj.has("patient")) {
          convertJsonObjectToPatient(obj.getJSONObject("patient"))
        } else if (obj.has("id") || obj.has("patientNo")) {
          convertJsonObjectToPatient(obj)
        } else null
      } else null
    } catch (_: Exception) {
      null
    }
  }

  private fun convertJsonObjectToPatient(obj: JSONObject): Patient {
    val id = obj.optString("id", "p-${System.currentTimeMillis()}")
    val patientNo = obj.optString("patientNo", "P-CHN-20260915-0001")
    val firstName = obj.optString("firstName", "Priya")
    val lastName = obj.optString("lastName", "Subramanian")
    val ageYears = obj.optInt("ageYears", 28)
    val gender = obj.optString("gender", "FEMALE")
    val mobile = obj.optString("mobile", "9876543210")
    val district = obj.optString("district", "Chennai")
    val state = obj.optString("state", "Tamil Nadu")
    val address = obj.optString("address", "Ward 42, T Nagar, Chennai, Tamil Nadu — 600017")
    val opdType = obj.optString("opdType", "General OPD")
    val doctorName = obj.optString("doctorName", "Dr. Priya Subramanian")
    val abha = obj.optString("abha", "${firstName.lowercase()}.${lastName.lowercase()}@abdm")

    return Patient(
      id = id,
      patientNo = patientNo,
      firstName = firstName,
      lastName = lastName,
      ageYears = ageYears,
      gender = gender,
      mobile = mobile,
      district = district,
      state = state,
      address = address,
      opdType = opdType,
      doctorName = doctorName,
      abha = abha,
      aadharMasked = "XXXX XXXX 8492",
      scheme = "PMJAY / TN CMCHIS",
      visits = ChennaiSeedData.defaultPatient.visits,
      vitals = ChennaiSeedData.defaultPatient.vitals,
      labRecords = ChennaiSeedData.defaultPatient.labRecords,
      prescriptions = ChennaiSeedData.defaultPatient.prescriptions
    )
  }
}
