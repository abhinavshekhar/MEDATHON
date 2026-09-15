package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.ChennaiSeedData
import com.example.data.local.SessionManager
import com.example.data.model.AbdmQrPayload
import com.example.data.model.Patient
import com.example.data.model.RegisterPatientRequest
import com.example.data.model.VitalLog
import com.example.data.repository.MedathonRepository
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit

sealed interface Screen {
  object Splash : Screen
  object Login : Screen
  object Register : Screen
  object Main : Screen
}

enum class MainTab {
  HOME,
  CARD,
  VITALS,
  RECORDS,
  PROFILE
}

data class AppUiState(
  val currentScreen: Screen = Screen.Splash,
  val currentTab: MainTab = MainTab.HOME,
  val isLoading: Boolean = false,
  val isRefreshingVitals: Boolean = false,
  val errorMessage: String? = null,
  val successMessage: String? = null,
  val patient: Patient? = null,
  val vitals: List<VitalLog> = emptyList(),
  val serverUrl: String = SessionManager.DEFAULT_SERVER_URL,
  val isServerOnline: Boolean? = null,
  val isDemoMode: Boolean = false
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

  private val sessionManager = SessionManager(application)
  private val repository = MedathonRepository(sessionManager)
  private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()

  private val _uiState = MutableStateFlow(
    AppUiState(
      serverUrl = sessionManager.serverUrl,
      isDemoMode = sessionManager.isDemoMode
    )
  )
  val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()

  init {
    checkInitialSession()
  }

  private fun checkInitialSession() {
    viewModelScope.launch {
      if (sessionManager.isLoggedIn) {
        val cached = sessionManager.getCachedPatient() ?: ChennaiSeedData.defaultPatient
        _uiState.update {
          it.copy(
            patient = cached,
            vitals = cached.vitals ?: emptyList(),
            currentScreen = Screen.Main,
            currentTab = MainTab.HOME,
            isDemoMode = sessionManager.isDemoMode
          )
        }
        refreshVitals(silent = true)
      } else {
        _uiState.update { it.copy(currentScreen = Screen.Splash) }
      }
    }
  }

  fun navigateTo(screen: Screen) {
    _uiState.update { it.copy(currentScreen = screen, errorMessage = null) }
  }

  fun selectTab(tab: MainTab) {
    _uiState.update { it.copy(currentTab = tab, errorMessage = null) }
  }

  fun login(mobile: String) {
    if (mobile.length < 10) {
      _uiState.update { it.copy(errorMessage = "Please enter a valid 10-digit mobile number") }
      return
    }

    viewModelScope.launch {
      _uiState.update { it.copy(isLoading = true, errorMessage = null) }
      val result = repository.loginWithMobile(mobile)
      result.fold(
        onSuccess = { patient ->
          _uiState.update {
            it.copy(
              isLoading = false,
              patient = patient,
              vitals = patient.vitals ?: emptyList(),
              currentScreen = Screen.Main,
              currentTab = MainTab.HOME,
              isDemoMode = sessionManager.isDemoMode,
              successMessage = "Welcome back, ${patient.firstName}!"
            )
          }
        },
        onFailure = { error ->
          _uiState.update {
            it.copy(
              isLoading = false,
              errorMessage = error.message ?: "Login failed. Please check network or register."
            )
          }
        }
      )
    }
  }

  fun register(request: RegisterPatientRequest) {
    viewModelScope.launch {
      _uiState.update { it.copy(isLoading = true, errorMessage = null) }
      val result = repository.registerPatient(request)
      result.fold(
        onSuccess = { newPatient ->
          _uiState.update {
            it.copy(
              isLoading = false,
              patient = newPatient,
              vitals = newPatient.vitals ?: emptyList(),
              currentScreen = Screen.Main,
              currentTab = MainTab.HOME,
              isDemoMode = sessionManager.isDemoMode,
              successMessage = "Registration successful! ABDM Health Card generated."
            )
          }
        },
        onFailure = { err ->
          _uiState.update {
            it.copy(
              isLoading = false,
              errorMessage = err.message ?: "Registration failed. Please try again."
            )
          }
        }
      )
    }
  }

  fun refreshVitals(silent: Boolean = false) {
    val patient = _uiState.value.patient ?: return
    viewModelScope.launch {
      if (!silent) _uiState.update { it.copy(isRefreshingVitals = true) }
      val result = repository.getPatientVitals(patient.id)
      result.fold(
        onSuccess = { vitalsList ->
          _uiState.update {
            it.copy(
              isRefreshingVitals = false,
              vitals = vitalsList,
              patient = patient.copy(vitals = vitalsList),
              successMessage = if (!silent) "Vitals synchronized with reception kiosk" else null
            )
          }
        },
        onFailure = {
          _uiState.update { it.copy(isRefreshingVitals = false) }
        }
      )
    }
  }

  fun simulateKioskCapture() {
    val patient = _uiState.value.patient ?: return
    val updated = repository.simulateKioskCapture(patient.id)
    _uiState.update {
      it.copy(
        patient = updated,
        vitals = updated.vitals ?: emptyList(),
        successMessage = "New vitals received from reception kiosk!"
      )
    }
  }

  fun updateProfile(mobile: String, address: String, district: String) {
    val updated = repository.updatePatientProfile(mobile, address, district)
    _uiState.update {
      it.copy(
        patient = updated,
        successMessage = "Profile details updated successfully."
      )
    }
  }

  fun updateServerUrl(url: String) {
    sessionManager.serverUrl = url
    _uiState.update { it.copy(serverUrl = sessionManager.serverUrl) }
    testServerConnection()
  }

  fun testServerConnection() {
    viewModelScope.launch {
      _uiState.update { it.copy(isLoading = true) }
      val client = OkHttpClient.Builder()
        .connectTimeout(3, TimeUnit.SECONDS)
        .readTimeout(3, TimeUnit.SECONDS)
        .build()

      try {
        val req = Request.Builder().url(sessionManager.serverUrl).head().build()
        val res = client.newCall(req).execute()
        _uiState.update {
          it.copy(
            isLoading = false,
            isServerOnline = res.isSuccessful || res.code in 200..404,
            successMessage = "Connected to Digital Twin backend: ${sessionManager.serverUrl}"
          )
        }
      } catch (_: Exception) {
        _uiState.update {
          it.copy(
            isLoading = false,
            isServerOnline = false,
            errorMessage = "Server unreachable. Operating in local Digital Twin mode."
          )
        }
      }
    }
  }

  fun getAbdmQrJson(): String {
    val patient = _uiState.value.patient ?: ChennaiSeedData.defaultPatient
    val payload = AbdmQrPayload(
      type = "medathon-patient",
      patientNo = patient.patientNo,
      patientId = patient.id,
      name = patient.fullName,
      abha = patient.abhaAddress
    )
    return try {
      moshi.adapter(AbdmQrPayload::class.java).toJson(payload)
    } catch (_: Exception) {
      """{"type":"medathon-patient","patientNo":"${patient.patientNo}","patientId":"${patient.id}","name":"${patient.fullName}","abha":"${patient.abhaAddress}"}"""
    }
  }

  fun clearError() {
    _uiState.update { it.copy(errorMessage = null) }
  }

  fun clearSuccess() {
    _uiState.update { it.copy(successMessage = null) }
  }

  fun logout() {
    sessionManager.clearSession()
    _uiState.update {
      it.copy(
        currentScreen = Screen.Login,
        patient = null,
        vitals = emptyList(),
        isDemoMode = false,
        successMessage = "Signed out securely"
      )
    }
  }
}
