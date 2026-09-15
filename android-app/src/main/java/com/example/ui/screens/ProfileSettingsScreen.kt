package com.example.ui.screens

import android.widget.Toast
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.NetworkCheck
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ChennaiSeedData
import com.example.ui.MainViewModel
import com.example.ui.components.InitialsAvatar
import com.example.ui.theme.MedathonEmerald
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonRose
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun ProfileSettingsScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  val patient = uiState.patient ?: ChennaiSeedData.defaultPatient
  val context = LocalContext.current
  val scrollState = rememberScrollState()

  var isEditingProfile by remember { mutableStateOf(false) }
  var editableMobile by remember { mutableStateOf(patient.mobile) }
  var editableAddress by remember { mutableStateOf(patient.address) }
  var editableDistrict by remember { mutableStateOf(patient.district) }

  var serverUrlInput by remember { mutableStateOf(uiState.serverUrl) }
  var showLogoutConfirmDialog by remember { mutableStateOf(false) }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .verticalScroll(scrollState)
      .padding(horizontal = 16.dp, vertical = 12.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp)
  ) {
    // Top Title
    Text(
      text = "Profile & Settings",
      style = MaterialTheme.typography.titleLarge,
      fontWeight = FontWeight.Bold,
      color = MaterialTheme.colorScheme.onBackground
    )

    // Patient Identity Card
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
      elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(18.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            InitialsAvatar(
              name = patient.fullName,
              age = patient.ageYears,
              modifier = Modifier.size(56.dp)
            )
            Spacer(modifier = Modifier.width(14.dp))
            Column {
              Text(
                text = patient.fullName,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
              )
              Text(
                text = "ABHA: ${patient.abhaAddress}",
                style = MaterialTheme.typography.bodySmall,
                color = MedathonTeal
              )
            }
          }

          IconButton(
            onClick = { isEditingProfile = !isEditingProfile },
            modifier = Modifier.testTag("toggle_edit_profile_button")
          ) {
            Icon(
              imageVector = if (isEditingProfile) Icons.Default.Save else Icons.Default.Edit,
              contentDescription = "Edit Profile",
              tint = MedathonTeal
            )
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Identification Chips
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(10.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Text("Patient ID:", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
              Text(patient.patientNo, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = MedathonNavy)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Text("Masked Aadhaar:", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
              Text(patient.aadharMasked ?: "XXXX XXXX 8492", fontWeight = FontWeight.SemiBold, color = MedathonNavy)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Text("Government Scheme:", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
              Surface(
                shape = RoundedCornerShape(4.dp),
                color = Color(0xFFD1FAE5)
              ) {
                Text(
                  text = patient.scheme ?: "PMJAY / TN CMCHIS",
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Bold,
                  color = Color(0xFF047857),
                  modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
              }
            }
          }
        }

        if (isEditingProfile) {
          Spacer(modifier = Modifier.height(14.dp))
          OutlinedTextField(
            value = editableMobile,
            onValueChange = { if (it.length <= 10 && it.all { ch -> ch.isDigit() }) editableMobile = it },
            label = { Text("Mobile Number") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp)
          )
          Spacer(modifier = Modifier.height(10.dp))
          OutlinedTextField(
            value = editableDistrict,
            onValueChange = { editableDistrict = it },
            label = { Text("District") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp)
          )
          Spacer(modifier = Modifier.height(10.dp))
          OutlinedTextField(
            value = editableAddress,
            onValueChange = { editableAddress = it },
            label = { Text("Address") },
            minLines = 2,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp)
          )
          Spacer(modifier = Modifier.height(12.dp))
          Button(
            onClick = {
              viewModel.updateProfile(editableMobile, editableAddress, editableDistrict)
              isEditingProfile = false
              Toast.makeText(context, "Profile details updated", Toast.LENGTH_SHORT).show()
            },
            colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp)
          ) {
            Text("Save Profile Changes")
          }
        }
      }
    }

    // Backend Server URL Configuration (Crucial for Digital Twin Hackathon Demo)
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
      elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(18.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Box(
            modifier = Modifier
              .size(36.dp)
              .clip(RoundedCornerShape(8.dp))
              .background(MedathonTealLight),
            contentAlignment = Alignment.Center
          ) {
            Icon(Icons.Default.Dns, contentDescription = "Server", tint = MedathonTeal)
          }
          Spacer(modifier = Modifier.width(10.dp))
          Column {
            Text(
              text = "Digital Twin Backend Server",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Bold
            )
            Text(
              text = "Configure API URL for Mobile + Kiosk + Desktop sync",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        OutlinedTextField(
          value = serverUrlInput,
          onValueChange = { serverUrlInput = it },
          label = { Text("Server Base URL") },
          placeholder = { Text("http://192.168.1.5:3000/") },
          singleLine = true,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("server_url_input"),
          shape = RoundedCornerShape(10.dp)
        )

        Spacer(modifier = Modifier.height(10.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          Button(
            onClick = {
              viewModel.updateServerUrl(serverUrlInput)
            },
            modifier = Modifier
              .weight(1f)
              .testTag("save_server_url_button"),
            colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal),
            shape = RoundedCornerShape(10.dp)
          ) {
            Text("Save & Connect")
          }

          OutlinedButton(
            onClick = {
              viewModel.testServerConnection()
            },
            modifier = Modifier
              .weight(1f)
              .testTag("test_server_connection_button"),
            shape = RoundedCornerShape(10.dp)
          ) {
            if (uiState.isLoading) {
              CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp, color = MedathonTeal)
            } else {
              Icon(Icons.Default.NetworkCheck, contentDescription = "Test", modifier = Modifier.size(16.dp))
              Spacer(modifier = Modifier.width(4.dp))
              Text("Test Ping", color = MedathonTeal)
            }
          }
        }

        if (uiState.isServerOnline != null) {
          Spacer(modifier = Modifier.height(10.dp))
          val online = uiState.isServerOnline == true
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = if (online) Color(0xFFD1FAE5) else Color(0xFFFFE4E6),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Icon(
                imageVector = if (online) Icons.Default.CheckCircle else Icons.Default.Error,
                contentDescription = null,
                tint = if (online) MedathonEmerald else MedathonRose,
                modifier = Modifier.size(16.dp)
              )
              Spacer(modifier = Modifier.width(8.dp))
              Text(
                text = if (online) "Digital Twin Backend Online" else "Server Offline (Using Local Digital Twin Data)",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = if (online) Color(0xFF047857) else MedathonRose
              )
            }
          }
        }
      }
    }

    // Sign Out Button
    OutlinedButton(
      onClick = { showLogoutConfirmDialog = true },
      modifier = Modifier
        .fillMaxWidth()
        .height(50.dp)
        .testTag("profile_logout_button"),
      shape = RoundedCornerShape(12.dp),
      colors = ButtonDefaults.outlinedButtonColors(contentColor = MedathonRose)
    ) {
      Icon(Icons.Default.ExitToApp, contentDescription = "Sign Out")
      Spacer(modifier = Modifier.width(8.dp))
      Text("Sign Out", fontWeight = FontWeight.Bold)
    }

    Spacer(modifier = Modifier.height(20.dp))
  }

  if (showLogoutConfirmDialog) {
    AlertDialog(
      onDismissRequest = { showLogoutConfirmDialog = false },
      title = { Text("Confirm Sign Out") },
      text = { Text("Are you sure you want to sign out from your MEDATHON patient account?") },
      confirmButton = {
        Button(
          onClick = {
            showLogoutConfirmDialog = false
            viewModel.logout()
          },
          colors = ButtonDefaults.buttonColors(containerColor = MedathonRose)
        ) {
          Text("Sign Out")
        }
      },
      dismissButton = {
        TextButton(onClick = { showLogoutConfirmDialog = false }) {
          Text("Cancel")
        }
      }
    )
  }
}
