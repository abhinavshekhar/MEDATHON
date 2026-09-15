package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.DeviceHub
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.LocalPharmacy
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ChennaiSeedData
import com.example.ui.MainTab
import com.example.ui.MainViewModel
import com.example.ui.components.InitialsAvatar
import com.example.ui.components.MetricBox
import com.example.ui.components.StatusBadge
import com.example.ui.theme.MedathonAmber
import com.example.ui.theme.MedathonEmerald
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonRose
import com.example.ui.theme.MedathonSky
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun HomeScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  val patient = uiState.patient ?: ChennaiSeedData.defaultPatient
  val vitalsList = uiState.vitals.ifEmpty { patient.vitals ?: emptyList() }
  val latestVital = vitalsList.firstOrNull()
  val upcomingVisits = patient.visits ?: emptyList()
  val context = LocalContext.current
  val scrollState = rememberScrollState()

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .verticalScroll(scrollState)
      .padding(horizontal = 16.dp, vertical = 12.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp)
  ) {
    // Top Greeting & Patient Header
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
      elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(18.dp)) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween,
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            InitialsAvatar(
              name = patient.fullName,
              age = patient.ageYears,
              modifier = Modifier.size(50.dp)
            )
            Spacer(modifier = Modifier.width(14.dp))
            Column {
              Text(
                text = "Vanakkam, ${patient.firstName}!",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
              )
              Text(
                text = "${patient.gender.lowercase().replaceFirstChar { it.uppercase() }}, ${patient.ageYears} yrs · ${patient.district}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
              )
            }
          }

          IconButton(
            onClick = { viewModel.refreshVitals() },
            modifier = Modifier.testTag("refresh_vitals_icon_button")
          ) {
            if (uiState.isRefreshingVitals) {
              CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                strokeWidth = 2.dp,
                color = MedathonTeal
              )
            } else {
              Icon(
                Icons.Default.Refresh,
                contentDescription = "Refresh",
                tint = MedathonTeal
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Monospace Patient ID with Copy action
        Surface(
          shape = RoundedCornerShape(10.dp),
          color = MedathonNavy,
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier
              .clickable {
                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                clipboard.setPrimaryClip(ClipData.newPlainText("Patient ID", patient.patientNo))
                Toast.makeText(context, "Patient ID copied: ${patient.patientNo}", Toast.LENGTH_SHORT).show()
              }
              .padding(horizontal = 14.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Text(
                text = "PATIENT ID: ",
                style = MaterialTheme.typography.labelSmall,
                color = Color(0xFF94A3B8)
              )
              Text(
                text = patient.patientNo,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF67E8F9),
                fontSize = 13.sp
              )
            }
            Icon(
              imageVector = Icons.Default.ContentCopy,
              contentDescription = "Copy ID",
              tint = Color(0xFF67E8F9),
              modifier = Modifier.size(16.dp)
            )
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Digital Twin node sync status
        Row(
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier.fillMaxWidth()
        ) {
          Box(
            modifier = Modifier
              .size(8.dp)
              .clip(CircleShape)
              .background(MedathonEmerald)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "Digital Twin Node · Synced with Reception Kiosk & Desktop HIMS",
            style = MaterialTheme.typography.labelSmall,
            color = MedathonTeal,
            fontWeight = FontWeight.Medium
          )
        }
      }
    }

    // 1. ABDM Health Card Teaser Banner
    Card(
      shape = RoundedCornerShape(18.dp),
      colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)),
      modifier = Modifier
        .fillMaxWidth()
        .border(1.dp, Color(0xFFFDE68A), RoundedCornerShape(18.dp))
        .clickable { viewModel.selectTab(MainTab.CARD) }
        .testTag("home_abdm_card_banner")
    ) {
      Row(
        modifier = Modifier.padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
          Box(
            modifier = Modifier
              .size(46.dp)
              .clip(RoundedCornerShape(12.dp))
              .background(MedathonAmber),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.QrCode,
              contentDescription = "ABDM Card",
              tint = Color.White,
              modifier = Modifier.size(28.dp)
            )
          }
          Spacer(modifier = Modifier.width(12.dp))
          Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Text(
                text = "ABDM Health Card",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF78350F)
              )
              Spacer(modifier = Modifier.width(6.dp))
              Surface(
                shape = RoundedCornerShape(4.dp),
                color = Color(0xFFD97706)
              ) {
                Text(
                  text = "QR READY",
                  fontSize = 9.sp,
                  fontWeight = FontWeight.Bold,
                  color = Color.White,
                  modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                )
              }
            }
            Text(
              text = patient.abhaAddress,
              style = MaterialTheme.typography.bodySmall,
              color = Color(0xFF92400E)
            )
          }
        }
        Icon(
          imageVector = Icons.Default.ArrowForward,
          contentDescription = "Open Card",
          tint = Color(0xFF78350F)
        )
      }
    }

    // 2. Latest Vitals (Kiosk Synced)
    Card(
      shape = RoundedCornerShape(18.dp),
      colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
      elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween,
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(MedathonTealLight),
              contentAlignment = Alignment.Center
            ) {
              Icon(
                imageVector = Icons.Default.Favorite,
                contentDescription = "Vitals",
                tint = MedathonTeal,
                modifier = Modifier.size(18.dp)
              )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
              Text(
                text = "Latest Vitals",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
              )
              Text(
                text = latestVital?.source ?: "Captured at reception kiosk",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
              )
            }
          }

          TextButton(
            onClick = { viewModel.selectTab(MainTab.VITALS) },
            modifier = Modifier.testTag("view_all_vitals_button")
          ) {
            Text("History", color = MedathonTeal, fontWeight = FontWeight.SemiBold)
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        if (latestVital != null) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            MetricBox(
              label = "Heart Rate",
              value = "${latestVital.heartRate}",
              unit = "bpm",
              icon = Icons.Default.Favorite,
              accentColor = MedathonRose,
              modifier = Modifier.weight(1f)
            )
            MetricBox(
              label = "SpO2",
              value = "${latestVital.spo2}",
              unit = "%",
              icon = Icons.Default.DeviceHub,
              accentColor = MedathonSky,
              modifier = Modifier.weight(1f)
            )
          }

          Spacer(modifier = Modifier.height(8.dp))

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            MetricBox(
              label = "Temperature",
              value = "${latestVital.temperature}",
              unit = "°F",
              icon = Icons.Default.Thermostat,
              accentColor = MedathonAmber,
              modifier = Modifier.weight(1f)
            )
            MetricBox(
              label = "Blood Pressure",
              value = "${latestVital.bpSystolic}/${latestVital.bpDiastolic}",
              unit = "mmHg",
              icon = Icons.Default.MedicalServices,
              accentColor = MedathonEmerald,
              modifier = Modifier.weight(1f)
            )
          }

          Spacer(modifier = Modifier.height(12.dp))

          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
          ) {
            Text(
              text = "Recorded: ${latestVital.timestamp}",
              style = MaterialTheme.typography.labelSmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // Simulate kiosk capture action for immediate testing
            FilledTonalButton(
              onClick = { viewModel.simulateKioskCapture() },
              modifier = Modifier.testTag("simulate_kiosk_button")
            ) {
              Text("Simulate Kiosk Capture", fontSize = 12.sp)
            }
          }
        } else {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 16.dp),
            contentAlignment = Alignment.Center
          ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
              Text(
                text = "No vitals recorded yet",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
              )
              Spacer(modifier = Modifier.height(6.dp))
              Button(
                onClick = { viewModel.simulateKioskCapture() },
                colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
              ) {
                Text("Simulate Reception Kiosk Scan")
              }
            }
          }
        }
      }
    }

    // 3. Upcoming Appointments
    Card(
      shape = RoundedCornerShape(18.dp),
      colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
      elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween,
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(MedathonTealLight),
              contentAlignment = Alignment.Center
            ) {
              Icon(
                imageVector = Icons.Default.Event,
                contentDescription = "Appointments",
                tint = MedathonTeal,
                modifier = Modifier.size(18.dp)
              )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Text(
              text = "OPD Consultations",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Bold
            )
          }

          TextButton(onClick = { viewModel.selectTab(MainTab.RECORDS) }) {
            Text("All Visits", color = MedathonTeal)
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        val currentVisit = upcomingVisits.firstOrNull()
        if (currentVisit != null) {
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                  Text(
                    text = currentVisit.opdType,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                  )
                  if (currentVisit.tokenNo != null) {
                    Spacer(modifier = Modifier.width(8.dp))
                    Surface(
                      shape = RoundedCornerShape(4.dp),
                      color = MedathonTeal
                    ) {
                      Text(
                        text = "Token #${currentVisit.tokenNo}",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                      )
                    }
                  }
                }
                Text(
                  text = currentVisit.doctorName,
                  style = MaterialTheme.typography.bodySmall,
                  color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                  text = currentVisit.date,
                  style = MaterialTheme.typography.labelSmall,
                  color = MedathonTeal
                )
              }
              StatusBadge(status = currentVisit.status)
            }
          }
        }
      }
    }

    // 4. Clinical Records Summary Card
    Card(
      shape = RoundedCornerShape(18.dp),
      colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
      elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
      modifier = Modifier
        .fillMaxWidth()
        .clickable { viewModel.selectTab(MainTab.RECORDS) }
        .testTag("home_records_summary_card")
    ) {
      Row(
        modifier = Modifier.padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Box(
            modifier = Modifier
              .size(42.dp)
              .clip(RoundedCornerShape(10.dp))
              .background(MedathonTealLight),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.Science,
              contentDescription = "Records",
              tint = MedathonTeal,
              modifier = Modifier.size(24.dp)
            )
          }
          Spacer(modifier = Modifier.width(12.dp))
          Column {
            Text(
              text = "Lab Reports & Prescriptions",
              style = MaterialTheme.typography.titleSmall,
              fontWeight = FontWeight.Bold
            )
            Text(
              text = "${patient.labRecords?.size ?: 0} Lab tests · ${patient.prescriptions?.size ?: 0} Prescriptions",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }

        Icon(
          imageVector = Icons.Default.ArrowForward,
          contentDescription = "View Records",
          tint = MedathonTeal
        )
      }
    }
  }
}
