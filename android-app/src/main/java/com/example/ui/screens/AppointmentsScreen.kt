package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ChennaiSeedData
import com.example.data.model.OPDVisit
import com.example.ui.MainViewModel
import com.example.ui.components.StatusBadge
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.random.Random

@Composable
fun AppointmentsScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  val patient = uiState.patient ?: ChennaiSeedData.defaultPatient
  val visits = patient.visits ?: emptyList()
  var showBookDialog by remember { mutableStateOf(false) }

  Scaffold(
    floatingActionButton = {
      FloatingActionButton(
        onClick = { showBookDialog = true },
        containerColor = MedathonTeal,
        contentColor = Color.White,
        modifier = Modifier.testTag("book_appointment_fab")
      ) {
        Icon(Icons.Default.Add, contentDescription = "Book OPD Visit")
      }
    },
    modifier = modifier
  ) { innerPadding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .background(MaterialTheme.colorScheme.background)
        .padding(innerPadding)
        .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
      // Header
      Column(modifier = Modifier.padding(bottom = 14.dp)) {
        Text(
          text = "OPD Consultations",
          style = MaterialTheme.typography.titleLarge,
          fontWeight = FontWeight.Bold,
          color = MaterialTheme.colorScheme.onBackground
        )
        Text(
          text = "Synchronized with Chennai Hospital Desktop HIMS",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
      }

      if (visits.isEmpty()) {
        Box(
          modifier = Modifier.fillMaxSize(),
          contentAlignment = Alignment.Center
        ) {
          Text("No consultations scheduled.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
      } else {
        LazyColumn(
          verticalArrangement = Arrangement.spacedBy(12.dp),
          modifier = Modifier.fillMaxSize()
        ) {
          items(visits, key = { it.id }) { visit ->
            AppointmentItemCard(visit)
          }
        }
      }
    }
  }

  if (showBookDialog) {
    var reason by remember { mutableStateOf("Follow-up consultation") }
    var selectedOpd by remember { mutableStateOf("General OPD") }

    AlertDialog(
      onDismissRequest = { showBookDialog = false },
      title = { Text("Book Walk-In OPD Consultation", fontWeight = FontWeight.Bold) },
      text = {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
          Text("Patient: ${patient.fullName} (${patient.patientNo})", style = MaterialTheme.typography.bodyMedium)
          OutlinedTextField(
            value = selectedOpd,
            onValueChange = { selectedOpd = it },
            label = { Text("Specialty / OPD") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
          )
          OutlinedTextField(
            value = reason,
            onValueChange = { reason = it },
            label = { Text("Reason for visit") },
            minLines = 2,
            modifier = Modifier.fillMaxWidth()
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            showBookDialog = false
            val newVisit = OPDVisit(
              id = "visit-${System.currentTimeMillis()}",
              patientId = patient.id,
              date = "Today, ${SimpleDateFormat("hh:mm a", Locale.ENGLISH).format(Date())}",
              opdType = selectedOpd,
              doctorName = "Dr. Priya Subramanian",
              reason = reason,
              status = "IN_QUEUE",
              tokenNo = Random.nextInt(16, 40)
            )
            val updated = patient.copy(visits = listOf(newVisit) + (patient.visits ?: emptyList()))
            viewModel.updateProfile(updated.mobile, updated.address, updated.district)
          },
          colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
        ) {
          Text("Confirm Booking")
        }
      },
      dismissButton = {
        TextButton(onClick = { showBookDialog = false }) {
          Text("Cancel")
        }
      }
    )
  }
}

@Composable
private fun AppointmentItemCard(visit: OPDVisit) {
  Card(
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    modifier = Modifier
      .fillMaxWidth()
      .testTag("appointment_item_${visit.id}")
  ) {
    Column(modifier = Modifier.padding(16.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Box(
            modifier = Modifier
              .size(36.dp)
              .clip(CircleShape)
              .background(MedathonTealLight),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.Event,
              contentDescription = "Event",
              tint = MedathonTeal,
              modifier = Modifier.size(20.dp)
            )
          }
          Spacer(modifier = Modifier.width(10.dp))
          Column {
            Text(
              text = visit.opdType,
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Bold,
              color = MaterialTheme.colorScheme.onSurface
            )
            Text(
              text = visit.date,
              style = MaterialTheme.typography.bodySmall,
              color = MedathonTeal
            )
          }
        }

        StatusBadge(status = visit.status)
      }

      Spacer(modifier = Modifier.height(12.dp))

      Surface(
        shape = RoundedCornerShape(10.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
        modifier = Modifier.fillMaxWidth()
      ) {
        Column(modifier = Modifier.padding(12.dp)) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
              imageVector = Icons.Default.Person,
              contentDescription = "Doctor",
              tint = MedathonTeal,
              modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
              text = visit.doctorName,
              style = MaterialTheme.typography.bodyMedium,
              fontWeight = FontWeight.SemiBold,
              color = MaterialTheme.colorScheme.onSurface
            )
          }
          Spacer(modifier = Modifier.height(4.dp))
          Text(
            text = "Reason: ${visit.reason}",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }
      }

      if (visit.tokenNo != null) {
        Spacer(modifier = Modifier.height(8.dp))
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = "Digital Twin Live Queue",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
          Surface(
            shape = RoundedCornerShape(6.dp),
            color = MedathonNavy
          ) {
            Text(
              text = "QUEUE TOKEN #${visit.tokenNo}",
              fontSize = 10.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFF67E8F9),
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
            )
          }
        }
      }
    }
  }
}
