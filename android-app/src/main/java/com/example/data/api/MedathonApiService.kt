package com.example.data.api

import com.example.data.model.Patient
import com.example.data.model.RegisterPatientRequest
import com.example.data.model.VitalLog
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface MedathonApiService {

  @GET("api/patients")
  suspend fun searchPatients(
    @Query("q") query: String
  ): Response<ResponseBody>

  @GET("api/patients/{id}")
  suspend fun getPatientById(
    @Path("id") id: String
  ): Response<Patient>

  @POST("api/patients")
  suspend fun registerPatient(
    @Body request: RegisterPatientRequest
  ): Response<ResponseBody>

  @GET("api/patients/lookup/{patientNo}")
  suspend fun lookupPatientByNo(
    @Path("patientNo") patientNo: String
  ): Response<Patient>

  @GET("api/vitals")
  suspend fun getVitalsByPatientId(
    @Query("patientId") patientId: String
  ): Response<List<VitalLog>>
}
