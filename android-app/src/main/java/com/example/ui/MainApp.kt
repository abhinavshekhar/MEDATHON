package com.example.ui

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.outlined.Assignment
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.QrCode
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.ui.screens.AbdmCardScreen
import com.example.ui.screens.AppointmentsScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.LoginScreen
import com.example.ui.screens.ProfileSettingsScreen
import com.example.ui.screens.RecordsScreen
import com.example.ui.screens.RegistrationScreen
import com.example.ui.screens.SplashScreen
import com.example.ui.screens.VitalsScreen
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun MainApp(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  val snackbarHostState = remember { SnackbarHostState() }

  LaunchedEffect(uiState.errorMessage) {
    uiState.errorMessage?.let { msg ->
      snackbarHostState.showSnackbar(msg)
      viewModel.clearError()
    }
  }

  LaunchedEffect(uiState.successMessage) {
    uiState.successMessage?.let { msg ->
      snackbarHostState.showSnackbar(msg)
      viewModel.clearSuccess()
    }
  }

  when (uiState.currentScreen) {
    is Screen.Splash -> {
      SplashScreen(viewModel = viewModel, modifier = modifier)
    }
    is Screen.Login -> {
      LoginScreen(viewModel = viewModel, modifier = modifier)
    }
    is Screen.Register -> {
      RegistrationScreen(viewModel = viewModel, modifier = modifier)
    }
    is Screen.Main -> {
      Scaffold(
        snackbarHost = {
          SnackbarHost(hostState = snackbarHostState) { data ->
            Snackbar(
              snackbarData = data,
              containerColor = MaterialTheme.colorScheme.surfaceVariant,
              contentColor = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
        },
        bottomBar = {
          NavigationBar(
            containerColor = MaterialTheme.colorScheme.surface,
            tonalElevation = 8.dp,
            modifier = Modifier.testTag("bottom_navigation_bar")
          ) {
            NavigationBarItem(
              selected = uiState.currentTab == MainTab.HOME,
              onClick = { viewModel.selectTab(MainTab.HOME) },
              icon = {
                Icon(
                  if (uiState.currentTab == MainTab.HOME) Icons.Filled.Home else Icons.Outlined.Home,
                  contentDescription = "Home"
                )
              },
              label = { Text("Home", fontWeight = FontWeight.SemiBold) },
              colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MedathonTeal,
                selectedTextColor = MedathonTeal,
                indicatorColor = MedathonTealLight
              ),
              modifier = Modifier.testTag("nav_item_home")
            )

            NavigationBarItem(
              selected = uiState.currentTab == MainTab.CARD,
              onClick = { viewModel.selectTab(MainTab.CARD) },
              icon = {
                Icon(
                  if (uiState.currentTab == MainTab.CARD) Icons.Filled.QrCode else Icons.Outlined.QrCode,
                  contentDescription = "ABDM Card"
                )
              },
              label = { Text("Card", fontWeight = FontWeight.SemiBold) },
              colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MedathonTeal,
                selectedTextColor = MedathonTeal,
                indicatorColor = MedathonTealLight
              ),
              modifier = Modifier.testTag("nav_item_card")
            )

            NavigationBarItem(
              selected = uiState.currentTab == MainTab.VITALS,
              onClick = { viewModel.selectTab(MainTab.VITALS) },
              icon = {
                Icon(
                  if (uiState.currentTab == MainTab.VITALS) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                  contentDescription = "Vitals"
                )
              },
              label = { Text("Vitals", fontWeight = FontWeight.SemiBold) },
              colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MedathonTeal,
                selectedTextColor = MedathonTeal,
                indicatorColor = MedathonTealLight
              ),
              modifier = Modifier.testTag("nav_item_vitals")
            )

            NavigationBarItem(
              selected = uiState.currentTab == MainTab.RECORDS,
              onClick = { viewModel.selectTab(MainTab.RECORDS) },
              icon = {
                Icon(
                  if (uiState.currentTab == MainTab.RECORDS) Icons.Filled.Assignment else Icons.Outlined.Assignment,
                  contentDescription = "Records"
                )
              },
              label = { Text("Records", fontWeight = FontWeight.SemiBold) },
              colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MedathonTeal,
                selectedTextColor = MedathonTeal,
                indicatorColor = MedathonTealLight
              ),
              modifier = Modifier.testTag("nav_item_records")
            )

            NavigationBarItem(
              selected = uiState.currentTab == MainTab.PROFILE,
              onClick = { viewModel.selectTab(MainTab.PROFILE) },
              icon = {
                Icon(
                  if (uiState.currentTab == MainTab.PROFILE) Icons.Filled.Person else Icons.Outlined.Person,
                  contentDescription = "Profile"
                )
              },
              label = { Text("Profile", fontWeight = FontWeight.SemiBold) },
              colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MedathonTeal,
                selectedTextColor = MedathonTeal,
                indicatorColor = MedathonTealLight
              ),
              modifier = Modifier.testTag("nav_item_profile")
            )
          }
        },
        modifier = modifier.fillMaxSize()
      ) { innerPadding ->
        Box(
          modifier = Modifier
            .fillMaxSize()
            .padding(innerPadding)
        ) {
          AnimatedContent(
            targetState = uiState.currentTab,
            transitionSpec = { fadeIn() togetherWith fadeOut() },
            label = "tab_transition"
          ) { tab ->
            when (tab) {
              MainTab.HOME -> HomeScreen(viewModel = viewModel)
              MainTab.CARD -> AbdmCardScreen(viewModel = viewModel)
              MainTab.VITALS -> VitalsScreen(viewModel = viewModel)
              MainTab.RECORDS -> RecordsScreen(viewModel = viewModel)
              MainTab.PROFILE -> ProfileSettingsScreen(viewModel = viewModel)
            }
          }
        }
      }
    }
  }
}
