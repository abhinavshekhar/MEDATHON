package com.example.ui.screens

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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ChennaiSeedData
import com.example.data.model.RegisterPatientRequest
import com.example.ui.MainViewModel
import com.example.ui.Screen
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegistrationScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  var currentStep by remember { mutableIntStateOf(1) }
  val scrollState = rememberScrollState()

  // Step 1: Basic Details
  var firstName by remember { mutableStateOf("Karthik") }
  var lastName by remember { mutableStateOf("Iyer") }
  var ageText by remember { mutableStateOf("32") }
  var gender by remember { mutableStateOf("MALE") } // Strict: "MALE" or "FEMALE" only

  // Step 2: Contact & Address
  var mobile by remember { mutableStateOf("9444012345") }
  var address by remember { mutableStateOf("Flat 3B, 2nd Main Road, Anna Nagar") }
  var district by remember { mutableStateOf("Chennai") }
  var pinCode by remember { mutableStateOf("600040") }
  val state = "Tamil Nadu"

  // Step 3: OPD & Doctor
  var opdType by remember { mutableStateOf(ChennaiSeedData.opdTypes[0]) }
  var doctorName by remember { mutableStateOf(ChennaiSeedData.chennaiDoctors[0]) }
  var reason by remember { mutableStateOf("General routine health checkup") }

  // Dropdown states
  var opdMenuExpanded by remember { mutableStateOf(false) }
  var docMenuExpanded by remember { mutableStateOf(false) }
  var districtMenuExpanded by remember { mutableStateOf(false) }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .verticalScroll(scrollState)
      .padding(horizontal = 24.dp, vertical = 16.dp),
    verticalArrangement = Arrangement.SpaceBetween
  ) {
    Column {
      // Top bar
      Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth()
      ) {
        IconButton(
          onClick = {
            if (currentStep > 1) currentStep-- else viewModel.navigateTo(Screen.Login)
          },
          modifier = Modifier.testTag("reg_back_button")
        ) {
          Icon(Icons.Default.ArrowBack, contentDescription = "Back")
        }
        Spacer(modifier = Modifier.width(8.dp))
        Column {
          Text(
            text = "Self Registration",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
          )
          Text(
            text = "Step $currentStep of 3",
            style = MaterialTheme.typography.bodySmall,
            color = MedathonTeal
          )
        }
      }

      Spacer(modifier = Modifier.height(12.dp))

      LinearProgressIndicator(
        progress = { currentStep / 3f },
        modifier = Modifier
          .fillMaxWidth()
          .height(6.dp)
          .clip(RoundedCornerShape(3.dp)),
        color = MedathonTeal,
        trackColor = MedathonTealLight
      )

      Spacer(modifier = Modifier.height(24.dp))

      // STEP 1: Personal Info
      if (currentStep == 1) {
        Text(
          text = "Personal Details",
          style = MaterialTheme.typography.headlineSmall,
          fontWeight = FontWeight.Bold
        )
        Text(
          text = "Enter your legal identification information for ABDM records.",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedTextField(
          value = firstName,
          onValueChange = { firstName = it },
          label = { Text("First Name") },
          placeholder = { Text("e.g. Karthik") },
          singleLine = true,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("reg_first_name_input"),
          shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(14.dp))

        OutlinedTextField(
          value = lastName,
          onValueChange = { lastName = it },
          label = { Text("Last Name") },
          placeholder = { Text("e.g. Iyer") },
          singleLine = true,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("reg_last_name_input"),
          shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(14.dp))

        OutlinedTextField(
          value = ageText,
          onValueChange = { if (it.all { ch -> ch.isDigit() }) ageText = it },
          label = { Text("Age (in years)") },
          keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
          singleLine = true,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("reg_age_input"),
          shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(18.dp))

        Text(
          text = "Gender",
          style = MaterialTheme.typography.titleSmall,
          fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(8.dp))

        // Strict: MALE or FEMALE only
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
          GenderCard(
            label = "Male",
            selected = gender == "MALE",
            onClick = { gender = "MALE" },
            modifier = Modifier.weight(1f)
          )
          GenderCard(
            label = "Female",
            selected = gender == "FEMALE",
            onClick = { gender = "FEMALE" },
            modifier = Modifier.weight(1f)
          )
        }
      }

      // STEP 2: Contact & Address
      if (currentStep == 2) {
        Text(
          text = "Contact & Address",
          style = MaterialTheme.typography.headlineSmall,
          fontWeight = FontWeight.Bold
        )
        Text(
          text = "Chennai municipal residency & mobile contact details.",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedTextField(
          value = mobile,
          onValueChange = { if (it.length <= 10 && it.all { ch -> ch.isDigit() }) mobile = it },
          label = { Text("Mobile Number (+91)") },
          placeholder = { Text("9876543210") },
          keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
          singleLine = true,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("reg_mobile_input"),
          shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(14.dp))

        OutlinedTextField(
          value = address,
          onValueChange = { address = it },
          label = { Text("Address (Street, Ward, Locality)") },
          placeholder = { Text("Ward 42, T Nagar, Chennai") },
          minLines = 2,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("reg_address_input"),
          shape = RoundedCornerShape(12.dp)
        )

        Spacer(modifier = Modifier.height(14.dp))

        // District selector
        Box(modifier = Modifier.fillMaxWidth()) {
          OutlinedTextField(
            value = district,
            onValueChange = {},
            readOnly = true,
            label = { Text("District") },
            trailingIcon = {
              IconButton(onClick = { districtMenuExpanded = true }) {
                Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Select District")
              }
            },
            modifier = Modifier
              .fillMaxWidth()
              .clickable { districtMenuExpanded = true }
              .testTag("reg_district_select"),
            shape = RoundedCornerShape(12.dp)
          )

          DropdownMenu(
            expanded = districtMenuExpanded,
            onDismissRequest = { districtMenuExpanded = false }
          ) {
            DropdownMenuItem(
              text = { Text("Chennai (All Zones)") },
              onClick = { district = "Chennai"; districtMenuExpanded = false }
            )
            ChennaiSeedData.chennaiLocalities.forEach { loc ->
              DropdownMenuItem(
                text = { Text("Chennai — $loc") },
                onClick = { district = "Chennai ($loc)"; districtMenuExpanded = false }
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
          OutlinedTextField(
            value = state,
            onValueChange = {},
            readOnly = true,
            label = { Text("State") },
            modifier = Modifier.weight(1f),
            shape = RoundedCornerShape(12.dp)
          )

          OutlinedTextField(
            value = pinCode,
            onValueChange = { if (it.length <= 6 && it.all { ch -> ch.isDigit() }) pinCode = it },
            label = { Text("PIN Code") },
            placeholder = { Text("600017") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier
              .weight(1f)
              .testTag("reg_pincode_input"),
            shape = RoundedCornerShape(12.dp)
          )
        }
      }

      // STEP 3: OPD & Doctor
      if (currentStep == 3) {
        Text(
          text = "OPD & Doctor Visit",
          style = MaterialTheme.typography.headlineSmall,
          fontWeight = FontWeight.Bold
        )
        Text(
          text = "Schedule your initial consultation at Chennai Health Center.",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(20.dp))

        // OPD Type dropdown
        Box(modifier = Modifier.fillMaxWidth()) {
          OutlinedTextField(
            value = opdType,
            onValueChange = {},
            readOnly = true,
            label = { Text("OPD Specialty") },
            trailingIcon = {
              IconButton(onClick = { opdMenuExpanded = true }) {
                Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Select OPD")
              }
            },
            modifier = Modifier
              .fillMaxWidth()
              .clickable { opdMenuExpanded = true }
              .testTag("reg_opd_type_select"),
            shape = RoundedCornerShape(12.dp)
          )

          DropdownMenu(
            expanded = opdMenuExpanded,
            onDismissRequest = { opdMenuExpanded = false }
          ) {
            ChennaiSeedData.opdTypes.forEach { type ->
              DropdownMenuItem(
                text = { Text(type) },
                onClick = { opdType = type; opdMenuExpanded = false }
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Doctor dropdown
        Box(modifier = Modifier.fillMaxWidth()) {
          OutlinedTextField(
            value = doctorName,
            onValueChange = {},
            readOnly = true,
            label = { Text("Attending Doctor") },
            trailingIcon = {
              IconButton(onClick = { docMenuExpanded = true }) {
                Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Select Doctor")
              }
            },
            modifier = Modifier
              .fillMaxWidth()
              .clickable { docMenuExpanded = true }
              .testTag("reg_doctor_select"),
            shape = RoundedCornerShape(12.dp)
          )

          DropdownMenu(
            expanded = docMenuExpanded,
            onDismissRequest = { docMenuExpanded = false }
          ) {
            ChennaiSeedData.chennaiDoctors.forEach { doc ->
              DropdownMenuItem(
                text = { Text(doc) },
                onClick = { doctorName = doc; docMenuExpanded = false }
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        OutlinedTextField(
          value = reason,
          onValueChange = { reason = it },
          label = { Text("Reason for Visit") },
          placeholder = { Text("e.g. Routine checkup, BP review, fever") },
          minLines = 2,
          modifier = Modifier
            .fillMaxWidth()
            .testTag("reg_reason_input"),
          shape = RoundedCornerShape(12.dp)
        )
      }
    }

    Spacer(modifier = Modifier.height(32.dp))

    // Navigation Buttons
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      if (currentStep > 1) {
        OutlinedButton(
          onClick = { currentStep-- },
          modifier = Modifier
            .weight(1f)
            .height(52.dp),
          shape = RoundedCornerShape(12.dp)
        ) {
          Text("Previous")
        }
      }

      Button(
        onClick = {
          if (currentStep < 3) {
            currentStep++
          } else {
            val ageVal = ageText.toIntOrNull() ?: 28
            val fullAddr = "$address, $district, $state — $pinCode"
            val request = RegisterPatientRequest(
              firstName = firstName.trim(),
              lastName = lastName.trim(),
              ageYears = ageVal,
              gender = gender,
              mobile = mobile.trim(),
              district = district,
              state = state,
              address = fullAddr,
              opdType = opdType,
              doctorName = doctorName,
              referredBy = "Self / Walk-in",
              reason = reason.trim(),
              feeAmount = 0,
              paymentCollected = true
            )
            viewModel.register(request)
          }
        },
        enabled = !uiState.isLoading && (
          (currentStep == 1 && firstName.isNotBlank() && lastName.isNotBlank() && ageText.isNotBlank()) ||
          (currentStep == 2 && mobile.length == 10 && address.isNotBlank()) ||
          (currentStep == 3)
        ),
        modifier = Modifier
          .weight(1f)
          .height(52.dp)
          .testTag("reg_submit_or_next_button"),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
      ) {
        if (uiState.isLoading) {
          CircularProgressIndicator(
            modifier = Modifier.size(22.dp),
            color = Color.White,
            strokeWidth = 2.dp
          )
        } else {
          Text(
            text = if (currentStep == 3) "Complete & Generate QR" else "Next Step",
            fontWeight = FontWeight.Bold
          )
        }
      }
    }
  }
}

@Composable
private fun GenderCard(
  label: String,
  selected: Boolean,
  onClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  Surface(
    modifier = modifier
      .clip(RoundedCornerShape(12.dp))
      .border(
        width = if (selected) 2.dp else 1.dp,
        color = if (selected) MedathonTeal else MaterialTheme.colorScheme.outlineVariant,
        shape = RoundedCornerShape(12.dp)
      )
      .clickable { onClick() }
      .testTag("gender_card_${label.lowercase()}"),
    color = if (selected) MedathonTealLight else MaterialTheme.colorScheme.surface
  ) {
    Row(
      modifier = Modifier.padding(vertical = 14.dp, horizontal = 16.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.Center
    ) {
      if (selected) {
        Icon(
          imageVector = Icons.Default.Check,
          contentDescription = "Selected",
          tint = MedathonTeal,
          modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(6.dp))
      }
      Text(
        text = label,
        fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
        color = if (selected) MedathonNavy else MaterialTheme.colorScheme.onSurface
      )
    }
  }
}
