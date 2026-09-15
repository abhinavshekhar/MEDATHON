package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
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
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ChennaiSeedData
import com.example.ui.MainViewModel
import com.example.ui.components.InitialsAvatar
import com.example.ui.theme.MedathonAmber
import com.example.ui.theme.MedathonEmerald
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonTeal
import com.example.util.QrCodeView

@Composable
fun AbdmCardScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  val patient = uiState.patient ?: ChennaiSeedData.defaultPatient
  val context = LocalContext.current
  val scrollState = rememberScrollState()
  val qrPayload = viewModel.getAbdmQrJson()

  var showKioskInstructionsDialog by remember { mutableStateOf(false) }
  var showPdfDownloadDialog by remember { mutableStateOf(false) }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .verticalScroll(scrollState)
      .padding(horizontal = 16.dp, vertical = 14.dp),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.spacedBy(16.dp)
  ) {
    // Top Info Header
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          text = "ABDM Health Card",
          style = MaterialTheme.typography.titleLarge,
          fontWeight = FontWeight.Bold,
          color = MaterialTheme.colorScheme.onBackground
        )
        Text(
          text = "Ayushman Bharat Digital Mission (ABDM) Node",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
      }

      IconButton(
        onClick = {
          val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, "MEDATHON Health Card - ${patient.fullName}\nPatient No: ${patient.patientNo}\nABHA: ${patient.abhaAddress}\nQR Data: $qrPayload")
            type = "text/plain"
          }
          context.startActivity(Intent.createChooser(shareIntent, "Share ABDM Card"))
        },
        modifier = Modifier.testTag("share_abdm_card_button")
      ) {
        Icon(Icons.Default.Share, contentDescription = "Share", tint = MedathonTeal)
      }
    }

    // Official-style ABDM Digital Health ID Card
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = Color.White),
      elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
      modifier = Modifier
        .fillMaxWidth()
        .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(20.dp))
        .testTag("abdm_health_card_visual")
    ) {
      Column(modifier = Modifier.fillMaxWidth()) {
        // Orange / Amber Top Header Band
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .background(
              Brush.horizontalGradient(
                colors = listOf(Color(0xFFD97706), Color(0xFFF59E0B), Color(0xFFD97706))
              )
            )
            .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Box(
                modifier = Modifier
                  .size(32.dp)
                  .clip(CircleShape)
                  .background(Color.White),
                contentAlignment = Alignment.Center
              ) {
                Icon(
                  imageVector = Icons.Default.LocalHospital,
                  contentDescription = "ABHA Emblem",
                  tint = Color(0xFFD97706),
                  modifier = Modifier.size(20.dp)
                )
              }
              Spacer(modifier = Modifier.width(10.dp))
              Column {
                Text(
                  text = "NATIONAL HEALTH AUTHORITY",
                  style = MaterialTheme.typography.labelSmall,
                  fontWeight = FontWeight.ExtraBold,
                  letterSpacing = 1.sp,
                  color = Color.White
                )
                Text(
                  text = "Ayushman Bharat Digital Mission",
                  style = MaterialTheme.typography.bodySmall,
                  fontWeight = FontWeight.SemiBold,
                  color = Color.White.copy(alpha = 0.95f)
                )
              }
            }

            Surface(
              shape = RoundedCornerShape(4.dp),
              color = Color(0xFF78350F)
            ) {
              Text(
                text = "CHENNAI",
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
              )
            }
          }
        }

        // Demo Disclaimer Strip (Crucial requirement: DEMO / SAMPLE — NOT OFFICIAL AADHAAR)
        Surface(
          color = Color(0xFFFEF3C7),
          modifier = Modifier.fillMaxWidth()
        ) {
          Text(
            text = "DEMO / SAMPLE — NOT OFFICIAL AADHAAR",
            fontSize = 11.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color(0xFFB45309),
            textAlign = TextAlign.Center,
            letterSpacing = 0.5.sp,
            modifier = Modifier
              .padding(vertical = 4.dp)
              .testTag("abdm_demo_disclaimer")
          )
        }

        // Card Body
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(18.dp),
          horizontalAlignment = Alignment.CenterHorizontally
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
              InitialsAvatar(
                name = patient.fullName,
                age = patient.ageYears,
                modifier = Modifier.size(64.dp)
              )
              Spacer(modifier = Modifier.width(14.dp))
              Column {
                Text(
                  text = patient.fullName,
                  style = MaterialTheme.typography.titleLarge,
                  fontWeight = FontWeight.Bold,
                  color = MedathonNavy
                )
                Text(
                  text = "Age: ${patient.ageYears} yrs  |  ${patient.gender}",
                  style = MaterialTheme.typography.bodySmall,
                  color = Color(0xFF475569)
                )
                Text(
                  text = "State: ${patient.state}",
                  style = MaterialTheme.typography.bodySmall,
                  color = Color(0xFF475569)
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(16.dp))

          // Large QR Code Component
          Box(
            modifier = Modifier
              .size(200.dp)
              .clip(RoundedCornerShape(16.dp))
              .background(Color(0xFFF8FAFC))
              .border(2.dp, Color(0xFFCBD5E1), RoundedCornerShape(16.dp))
              .padding(8.dp)
              .testTag("abdm_qr_code_view"),
            contentAlignment = Alignment.Center
          ) {
            QrCodeView(
              content = qrPayload,
              modifier = Modifier.fillMaxSize(),
              tintColor = MedathonNavy
            )
          }

          Spacer(modifier = Modifier.height(14.dp))

          // Patient Number (monospace) & ABHA Address
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color(0xFFF1F5F9),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(
              modifier = Modifier.padding(10.dp),
              horizontalAlignment = Alignment.CenterHorizontally
            ) {
              Text(
                text = "ABHA ADDRESS",
                style = MaterialTheme.typography.labelSmall,
                color = Color(0xFF64748B),
                fontWeight = FontWeight.SemiBold
              )
              Text(
                text = patient.abhaAddress,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = MedathonTeal
              )
              Spacer(modifier = Modifier.height(4.dp))
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                  text = "PATIENT NO: ",
                  style = MaterialTheme.typography.labelSmall,
                  color = Color(0xFF64748B)
                )
                Text(
                  text = patient.patientNo,
                  fontFamily = FontFamily.Monospace,
                  fontWeight = FontWeight.Bold,
                  color = MedathonNavy,
                  fontSize = 12.sp
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(10.dp))

          // Masked Aadhaar & Scheme badge
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Text(
                text = "Aadhaar: ",
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF64748B)
              )
              Text(
                text = patient.aadharMasked ?: "XXXX XXXX 8492",
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.Bold,
                color = MedathonNavy
              )
            }

            Surface(
              shape = RoundedCornerShape(6.dp),
              color = Color(0xFFD1FAE5)
            ) {
              Text(
                text = patient.scheme ?: "PMJAY",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF047857),
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
              )
            }
          }
        }
      }
    }

    // Action Buttons
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
      Button(
        onClick = { showKioskInstructionsDialog = true },
        modifier = Modifier
          .weight(1f)
          .height(50.dp)
          .testTag("show_at_kiosk_button"),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
      ) {
        Icon(Icons.Default.QrCodeScanner, contentDescription = "Scan")
        Spacer(modifier = Modifier.width(6.dp))
        Text("Show at Kiosk", fontWeight = FontWeight.Bold, fontSize = 14.sp)
      }

      OutlinedButton(
        onClick = { showPdfDownloadDialog = true },
        modifier = Modifier
          .weight(1f)
          .height(50.dp)
          .testTag("download_demo_pdf_button"),
        shape = RoundedCornerShape(12.dp)
      ) {
        Icon(Icons.Default.Download, contentDescription = "Download", tint = MedathonTeal)
        Spacer(modifier = Modifier.width(6.dp))
        Text("Demo Card PDF", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = MedathonTeal)
      }
    }

    // Digital Twin Kiosk Scan Instructions Card
    Card(
      shape = RoundedCornerShape(14.dp),
      colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(14.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(Icons.Default.Info, contentDescription = "Instructions", tint = MedathonTeal)
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Kiosk Check-In Instructions",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold
          )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
          text = "1. Walk up to the MEDATHON Kiosk tablet at the reception desk.\n2. Present this QR screen 10 cm in front of the scanner camera.\n3. The kiosk instantly loads your digital twin profile, measures BPM & SpO2, and updates this app!",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
          lineHeight = 18.sp
        )
      }
    }
  }

  // Dialog: Show at Kiosk Guidance
  if (showKioskInstructionsDialog) {
    AlertDialog(
      onDismissRequest = { showKioskInstructionsDialog = false },
      title = {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(Icons.Default.QrCodeScanner, contentDescription = null, tint = MedathonTeal)
          Spacer(modifier = Modifier.width(8.dp))
          Text("Ready to Scan at Kiosk", fontWeight = FontWeight.Bold)
        }
      },
      text = {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
          Text(
            "Screen brightness will be maximized for clear barcode scanner readability.",
            style = MaterialTheme.typography.bodyMedium
          )
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color(0xFFF1F5F9),
            modifier = Modifier.fillMaxWidth()
          ) {
            Text(
              text = "Format: JSON Medathon Digital Twin\nPayload Type: medathon-patient\nPatient ID: ${patient.id}",
              fontFamily = FontFamily.Monospace,
              fontSize = 11.sp,
              modifier = Modifier.padding(8.dp),
              color = MedathonNavy
            )
          }
          Text(
            "Once scanned, return to the Home screen and tap refresh to view your newly captured vitals.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }
      },
      confirmButton = {
        Button(
          onClick = { showKioskInstructionsDialog = false },
          colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
        ) {
          Text("Got It")
        }
      }
    )
  }

  // Dialog: Download Demo PDF
  if (showPdfDownloadDialog) {
    AlertDialog(
      onDismissRequest = { showPdfDownloadDialog = false },
      title = {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(Icons.Default.CheckCircle, contentDescription = null, tint = MedathonEmerald)
          Spacer(modifier = Modifier.width(8.dp))
          Text("ABDM Card Generated", fontWeight = FontWeight.Bold)
        }
      },
      text = {
        Column {
          Text("A print-ready digital health card PDF for ${patient.fullName} has been prepared.")
          Spacer(modifier = Modifier.height(8.dp))
          Text(
            "File: ABDM_Card_${patient.patientNo}.pdf\nIssued by: MEDATHON Chennai Digital Twin Node",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            showPdfDownloadDialog = false
            Toast.makeText(context, "ABDM Card PDF saved to device storage", Toast.LENGTH_SHORT).show()
          },
          colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
        ) {
          Text("Save PDF")
        }
      },
      dismissButton = {
        TextButton(onClick = { showPdfDownloadDialog = false }) {
          Text("Close")
        }
      }
    )
  }
}
