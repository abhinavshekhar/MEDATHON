package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.MedathonAmber
import com.example.ui.theme.MedathonAmberLight
import com.example.ui.theme.MedathonEmerald
import com.example.ui.theme.MedathonEmeraldLight
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonRose
import com.example.ui.theme.MedathonRoseLight
import com.example.ui.theme.MedathonSky
import com.example.ui.theme.MedathonSkyLight
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun MedathonHeader(
  title: String,
  subtitle: String? = null,
  modifier: Modifier = Modifier
) {
  Row(
    modifier = modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp, vertical = 12.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.SpaceBetween
  ) {
    Row(verticalAlignment = Alignment.CenterVertically) {
      Box(
        modifier = Modifier
          .size(40.dp)
          .clip(RoundedCornerShape(10.dp))
          .background(MedathonTeal),
        contentAlignment = Alignment.Center
      ) {
        Icon(
          imageVector = Icons.Default.LocalHospital,
          contentDescription = "MEDATHON Cross",
          tint = Color.White,
          modifier = Modifier.size(24.dp)
        )
      }
      Spacer(modifier = Modifier.width(12.dp))
      Column {
        Text(
          text = title,
          style = MaterialTheme.typography.titleLarge,
          fontWeight = FontWeight.Bold,
          color = MaterialTheme.colorScheme.onBackground
        )
        if (subtitle != null) {
          Text(
            text = subtitle,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }
      }
    }
  }
}

@Composable
fun StatusBadge(
  status: String,
  modifier: Modifier = Modifier
) {
  val (bgColor, textColor, icon) = when (status.uppercase()) {
    "COMPLETED" -> Triple(MedathonEmeraldLight, MedathonEmerald, Icons.Default.CheckCircle)
    "WITH_DOCTOR" -> Triple(MedathonSkyLight, MedathonSky, Icons.Default.Info)
    "IN_QUEUE" -> Triple(MedathonAmberLight, MedathonAmber, Icons.Default.Warning)
    "REGISTERED" -> Triple(MedathonTealLight, MedathonTeal, Icons.Default.Info)
    else -> Triple(Color(0xFFF1F5F9), Color(0xFF475569), Icons.Default.Info)
  }

  Surface(
    modifier = modifier.testTag("status_badge_${status.lowercase()}"),
    shape = RoundedCornerShape(20.dp),
    color = bgColor
  ) {
    Row(
      modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      Icon(
        imageVector = icon,
        contentDescription = status,
        tint = textColor,
        modifier = Modifier.size(12.dp)
      )
      Spacer(modifier = Modifier.width(4.dp))
      Text(
        text = status.replace("_", " "),
        style = MaterialTheme.typography.labelSmall,
        fontWeight = FontWeight.SemiBold,
        color = textColor
      )
    }
  }
}

@Composable
fun PatientIdBadge(
  patientNo: String,
  modifier: Modifier = Modifier
) {
  Surface(
    modifier = modifier.testTag("patient_id_badge"),
    shape = RoundedCornerShape(8.dp),
    color = MedathonNavy
  ) {
    Text(
      text = patientNo,
      fontFamily = FontFamily.Monospace,
      fontSize = 12.sp,
      fontWeight = FontWeight.Bold,
      color = Color(0xFF67E8F9),
      modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    )
  }
}

@Composable
fun InitialsAvatar(
  name: String,
  age: Int,
  modifier: Modifier = Modifier
) {
  val initials = name.split(" ")
    .filter { it.isNotBlank() }
    .take(2)
    .map { it.first().uppercase() }
    .joinToString("")
    .ifEmpty { "P" }

  val bgBrush = when {
    age < 20 -> Brush.linearGradient(listOf(Color(0xFF38BDF8), Color(0xFF0284C7)))
    age < 50 -> Brush.linearGradient(listOf(Color(0xFF14B8A6), Color(0xFF05968C)))
    else -> Brush.linearGradient(listOf(Color(0xFFF59E0B), Color(0xFFD97706)))
  }

  Box(
    modifier = modifier
      .clip(CircleShape)
      .background(bgBrush),
    contentAlignment = Alignment.Center
  ) {
    Text(
      text = initials,
      color = Color.White,
      fontWeight = FontWeight.Bold,
      fontSize = 18.sp
    )
  }
}

@Composable
fun MetricBox(
  label: String,
  value: String,
  unit: String,
  icon: ImageVector,
  accentColor: Color,
  modifier: Modifier = Modifier
) {
  Card(
    modifier = modifier.testTag("metric_box_${label.lowercase()}"),
    shape = RoundedCornerShape(12.dp),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
  ) {
    Column(modifier = Modifier.padding(12.dp)) {
      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier.fillMaxWidth()
      ) {
        Text(
          text = label,
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Icon(
          imageVector = icon,
          contentDescription = label,
          tint = accentColor,
          modifier = Modifier.size(16.dp)
        )
      }
      Spacer(modifier = Modifier.height(6.dp))
      Row(verticalAlignment = Alignment.Bottom) {
        Text(
          text = value,
          style = MaterialTheme.typography.titleLarge,
          fontWeight = FontWeight.Bold,
          color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
          text = unit,
          style = MaterialTheme.typography.labelSmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant,
          modifier = Modifier.padding(bottom = 2.dp)
        )
      }
    }
  }
}
