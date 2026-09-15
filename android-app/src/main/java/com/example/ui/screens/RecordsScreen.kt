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
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.LocalPharmacy
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Science
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import com.example.data.model.LabRecord
import com.example.data.model.OPDVisit
import com.example.data.model.Prescription
import com.example.ui.MainViewModel
import com.example.ui.components.StatusBadge
import com.example.ui.theme.MedathonEmerald
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun RecordsScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  val patient = uiState.patient ?: ChennaiSeedData.defaultPatient
  var selectedTab by remember { mutableIntStateOf(0) }
  val tabs = listOf("Visits", "Lab Tests", "Prescriptions")

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .padding(horizontal = 16.dp, vertical = 12.dp)
  ) {
    // Header
    Column(modifier = Modifier.padding(bottom = 12.dp)) {
      Text(
        text = "Clinical Records",
        style = MaterialTheme.typography.titleLarge,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onBackground
      )
      Text(
        text = "Official records synchronized from Desktop HIMS (Read-Only)",
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )
    }

    // Tabs
    TabRow(
      selectedTabIndex = selectedTab,
      containerColor = MaterialTheme.colorScheme.surface,
      contentColor = MedathonTeal,
      modifier = Modifier
        .clip(RoundedCornerShape(12.dp))
        .padding(bottom = 14.dp)
    ) {
      tabs.forEachIndexed { index, title ->
        Tab(
          selected = selectedTab == index,
          onClick = { selectedTab = index },
          text = {
            Text(
              text = title,
              fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal
            )
          },
          modifier = Modifier.testTag("records_tab_${title.lowercase().replace(" ", "_")}")
        )
      }
    }

    // Tab Content
    when (selectedTab) {
      0 -> VisitsTabContent(patient.visits ?: emptyList())
      1 -> LabTabContent(patient.labRecords ?: emptyList())
      2 -> PrescriptionsTabContent(patient.prescriptions ?: emptyList())
    }
  }
}

@Composable
private fun VisitsTabContent(visits: List<OPDVisit>) {
  if (visits.isEmpty()) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
      Text("No consultation history.", color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
  } else {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxSize()) {
      items(visits, key = { it.id }) { visit ->
        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(16.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(
                text = visit.opdType,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
              )
              StatusBadge(status = visit.status)
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = "Doctor: ${visit.doctorName}", style = MaterialTheme.typography.bodyMedium)
            Text(text = "Date: ${visit.date}", style = MaterialTheme.typography.bodySmall, color = MedathonTeal)
            Spacer(modifier = Modifier.height(6.dp))
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
              modifier = Modifier.fillMaxWidth()
            ) {
              Text(
                text = "Reason: ${visit.reason}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(8.dp)
              )
            }
          }
        }
      }
    }
  }
}

@Composable
private fun LabTabContent(labs: List<LabRecord>) {
  if (labs.isEmpty()) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
      Text("No lab tests recorded.", color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
  } else {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxSize()) {
      items(labs, key = { it.id }) { lab ->
        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
          modifier = Modifier.fillMaxWidth()
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
                  Icon(Icons.Default.Science, contentDescription = "Lab", tint = MedathonTeal, modifier = Modifier.size(20.dp))
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                  Text(text = lab.testName, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
                  Text(text = "Reported: ${lab.date}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
              }

              Surface(
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFD1FAE5)
              ) {
                Text(
                  text = lab.status,
                  fontSize = 11.sp,
                  fontWeight = FontWeight.Bold,
                  color = Color(0xFF047857),
                  modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
              }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Surface(
              shape = RoundedCornerShape(10.dp),
              color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
              modifier = Modifier.fillMaxWidth()
            ) {
              Column(modifier = Modifier.padding(10.dp)) {
                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  Text(text = "Result Value:", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                  Text(text = lab.result, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = MedathonNavy)
                }
                if (lab.referenceRange != null) {
                  Spacer(modifier = Modifier.height(4.dp))
                  Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                  ) {
                    Text(text = "Reference Range:", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(text = lab.referenceRange, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                  }
                }
              }
            }

            if (lab.doctorNotes != null) {
              Spacer(modifier = Modifier.height(8.dp))
              Text(
                text = "Doctor Note: ${lab.doctorNotes}",
                style = MaterialTheme.typography.bodySmall,
                color = MedathonTeal
              )
            }
          }
        }
      }
    }
  }
}

@Composable
private fun PrescriptionsTabContent(prescriptions: List<Prescription>) {
  if (prescriptions.isEmpty()) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
      Text("No prescriptions issued.", color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
  } else {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxSize()) {
      items(prescriptions, key = { it.id }) { rx ->
        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
          elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
          modifier = Modifier.fillMaxWidth()
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
                  Icon(Icons.Default.LocalPharmacy, contentDescription = "Rx", tint = MedathonTeal, modifier = Modifier.size(20.dp))
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                  Text(text = rx.medication, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                  Text(text = "By ${rx.doctorName} · ${rx.date}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
              }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Surface(
              shape = RoundedCornerShape(10.dp),
              color = Color(0xFFF1F5F9),
              modifier = Modifier.fillMaxWidth()
            ) {
              Column(modifier = Modifier.padding(10.dp)) {
                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  Text(text = "Dosage Timing:", style = MaterialTheme.typography.bodyMedium, color = Color(0xFF475569))
                  Text(text = rx.dosage, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = MedathonNavy)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                  modifier = Modifier.fillMaxWidth(),
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  Text(text = "Duration:", style = MaterialTheme.typography.bodySmall, color = Color(0xFF475569))
                  Text(text = rx.duration, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.SemiBold, color = MedathonTeal)
                }
              }
            }

            if (rx.instructions != null) {
              Spacer(modifier = Modifier.height(8.dp))
              Text(
                text = "Instructions: ${rx.instructions}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
              )
            }
          }
        }
      }
    }
  }
}
