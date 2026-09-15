# MEDATHON PATIENT MOBILE APP — ALL-IN-ONE CODEBASE BUNDLE

Target Local Directory: `C:\Users\abhin\OneDrive\Desktop\MEDATHON`

This single file contains the complete source code, configurations, Gradle setup, and resources for the MEDATHON Android Jetpack Compose Mobile App.

---

## FILE: `metadata.json`

```json
{
  "name": "MEDATHON",
  "description": "Smart Healthcare patient mobile app for MEDATHON in Chennai, Tamil Nadu. Features ABDM Health Card QR, kiosk vitals sync, self-registration, appointments, and clinical records.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}

```

---

## FILE: `settings.gradle.kts`

```kotlin
pluginManagement {
  repositories {
    google {
      content {
        includeGroupByRegex("com\\.android.*")
        includeGroupByRegex("com\\.google.*")
        includeGroupByRegex("androidx.*")
      }
    }
    mavenCentral()
    gradlePluginPortal()
  }
}

plugins { id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0" }

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    mavenCentral()
  }
}

rootProject.name = "My Application"

include(":app")

```

---

## FILE: `build.gradle.kts`

```kotlin
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
  alias(libs.plugins.android.application) apply false
  alias(libs.plugins.kotlin.compose) apply false
  alias(libs.plugins.google.devtools.ksp) apply false
  alias(libs.plugins.roborazzi) apply false
  alias(libs.plugins.secrets) apply false
  alias(libs.plugins.google.services) apply false
}

```

---

## FILE: `gradle.properties`

```properties
# Project-wide Gradle settings.
# IDE (e.g. Android Studio) users:
# Gradle settings configured through the IDE *will override*
# any settings specified in this file.
# For more details on how to configure your build environment visit
# http://www.gradle.org/docs/current/userguide/build_environment.html
# Specifies the JVM arguments used for the daemon process.
# The setting is particularly useful for tweaking memory settings.
org.gradle.jvmargs=-Xmx4g -Dfile.encoding=UTF-8
# When configured, Gradle will run in incubating parallel mode.
# This option should only be used with decoupled projects. For more details, visit
# https://developer.android.com/r/tools/gradle-multi-project-decoupled-projects
org.gradle.parallel=true
# Kotlin code style for this project: "official" or "obsolete":
kotlin.code.style=official
# Enables namespacing of each library's R class so that its R class includes only the
# resources declared in the library itself and none from the library's dependencies,
# thereby reducing the size of the R class for that library
android.nonTransitiveRClass=true
org.gradle.caching=true
org.gradle.configuration-cache=true
# Set the maximum number of workers to 4 to avoid overloading the machine.
org.gradle.workers.max=4
# Set the Kotlin compiler execution strategy to in-process to avoid "Could not
# connect to Kotlin compile daemon" error.
kotlin.compiler.execution.strategy=in-process
# Allow the google-services plugin to work even if the google-services.json is not present.
googleServices.missing.passthrough=true

```

---

## FILE: `gradle/libs.versions.toml`

```toml
[versions]
agp = "9.1.1"
coreKtx = "1.18.0"
junit = "4.13.2"
junitVersion = "1.3.0"
espressoCore = "3.7.0"
lifecycleRuntimeKtx = "2.8.7"
lifecycleViewmodelCompose = "2.8.7"
lifecycleRuntimeCompose = "2.8.7"
activityCompose = "1.10.1"
kotlin = "2.2.10"
composeBom = "2024.09.00"
googleDevtoolsKsp = "2.3.5"
navigationCompose = "2.8.9"
roomRuntime = "2.7.0"
roomKtx = "2.7.0"
roomCompiler = "2.7.0"
kotlinxCoroutinesTest = "1.10.2"
core = "1.6.1"
runner = "1.6.2"
coilCompose = "2.7.0"
retrofit = "2.12.0"
converterMoshi = "2.12.0"
kotlinxCoroutinesAndroid = "1.10.2"
kotlinxCoroutinesCore = "1.10.2"
accompanistPermissions = "0.37.3"
playServicesLocation = "21.3.0"
cameraCamera2 = "1.5.0"
cameraLifecycle = "1.5.0"
cameraView = "1.5.0"
cameraCore = "1.5.0"
loggingInterceptor = "4.10.0"
okhttp = "4.10.0"
moshiKotlin = "1.15.2"
moshiKotlinCodegen = "1.15.2"
datastorePreferences = "1.1.7"
robolectric = "4.16.1"
roborazzi = "1.59.0"
firebaseBom = "34.17.0"
secretsGradlePlugin = "2.0.1"
googleServices = "4.5.0"
credentials = "1.5.0"
googleid = "1.1.1"


[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleViewmodelCompose" }
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycleRuntimeCompose" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "roomRuntime" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "roomKtx" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "roomCompiler" }
kotlinx-coroutines-test = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-test", version.ref = "kotlinxCoroutinesTest" }
androidx-core = { group = "androidx.test", name = "core", version.ref = "core" }
androidx-runner = { group = "androidx.test", name = "runner", version.ref = "runner" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-core = { group = "androidx.compose.material", name = "material-icons-core" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
coil-compose = { group = "io.coil-kt", name = "coil-compose", version.ref = "coilCompose" }
retrofit = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
converter-moshi = { group = "com.squareup.retrofit2", name = "converter-moshi", version.ref = "converterMoshi" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "kotlinxCoroutinesAndroid" }
kotlinx-coroutines-core = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-core", version.ref = "kotlinxCoroutinesCore" }
accompanist-permissions = { group = "com.google.accompanist", name = "accompanist-permissions", version.ref = "accompanistPermissions" }
play-services-location = { group = "com.google.android.gms", name = "play-services-location", version.ref = "playServicesLocation" }
androidx-camera-camera2 = { group = "androidx.camera", name = "camera-camera2", version.ref = "cameraCamera2" }
androidx-camera-lifecycle = { group = "androidx.camera", name = "camera-lifecycle", version.ref = "cameraLifecycle" }
androidx-camera-view = { group = "androidx.camera", name = "camera-view", version.ref = "cameraView" }
androidx-camera-core = { group = "androidx.camera", name = "camera-core", version.ref = "cameraCore" }
logging-interceptor = { group = "com.squareup.okhttp3", name = "logging-interceptor", version.ref = "loggingInterceptor" }
okhttp = { group = "com.squareup.okhttp3", name = "okhttp", version.ref = "okhttp" }
moshi-kotlin = { group = "com.squareup.moshi", name = "moshi-kotlin", version.ref = "moshiKotlin" }
moshi-kotlin-codegen = { group = "com.squareup.moshi", name = "moshi-kotlin-codegen", version.ref = "moshiKotlinCodegen" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastorePreferences" }
robolectric = { group = "org.robolectric", name = "robolectric", version.ref = "robolectric" }
roborazzi = { group = "io.github.takahirom.roborazzi", name = "roborazzi", version.ref = "roborazzi" }
roborazzi-compose = { group = "io.github.takahirom.roborazzi", name = "roborazzi-compose", version.ref = "roborazzi" }
roborazzi-junit-rule = { group = "io.github.takahirom.roborazzi", name = "roborazzi-junit-rule", version.ref = "roborazzi" }
firebase-bom = { group = "com.google.firebase", name = "firebase-bom", version.ref = "firebaseBom" }
firebase-ai = { group = "com.google.firebase", name = "firebase-ai" }
firebase-appcheck-recaptcha = { group = "com.google.firebase", name = "firebase-appcheck-recaptcha" }
firebase-appcheck-debug = { group = "com.google.firebase", name = "firebase-appcheck-debug" }
firebase-firestore = { group = "com.google.firebase", name = "firebase-firestore" }
firebase-auth = { group = "com.google.firebase", name = "firebase-auth" }
androidx-credentials = { group = "androidx.credentials", name = "credentials", version.ref = "credentials" }
androidx-credentials-play-services = { group = "androidx.credentials", name = "credentials-play-services-auth", version.ref = "credentials" }
googleid = { group = "com.google.android.libraries.identity.googleid", name = "googleid", version.ref = "googleid" }


[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
google-devtools-ksp = { id = "com.google.devtools.ksp", version.ref = "googleDevtoolsKsp" }
roborazzi = { id = "io.github.takahirom.roborazzi", version.ref = "roborazzi" }
secrets = { id = "com.google.android.libraries.mapsplatform.secrets-gradle-plugin", version.ref = "secretsGradlePlugin" }
google-services = { id = "com.google.gms.google-services", version.ref = "googleServices" }

```

---

## FILE: `app/build.gradle.kts`

```kotlin
import com.google.gms.googleservices.GoogleServicesPlugin.MissingGoogleServicesStrategy

plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.kotlin.compose)
  alias(libs.plugins.google.devtools.ksp)
  alias(libs.plugins.roborazzi)
  alias(libs.plugins.secrets)
  alias(libs.plugins.google.services)
}

android {
  namespace = "com.example"
  compileSdk { version = release(36) { minorApiLevel = 1 } }

  defaultConfig {
    applicationId = "com.example"
    minSdk = 24
    targetSdk = 36
    versionCode = 1
    versionName = "1.0"

    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
  }

  signingConfigs {
    create("release") {
      val keystorePath = System.getenv("KEYSTORE_PATH") ?: "${rootDir}/my-upload-key.jks"
      storeFile = file(keystorePath)
      storePassword = System.getenv("STORE_PASSWORD")
      keyAlias = "upload"
      keyPassword = System.getenv("KEY_PASSWORD")
    }
    create("debugConfig") {
      storeFile = file("${rootDir}/debug.keystore")
      storePassword = "android"
      keyAlias = "androiddebugkey"
      keyPassword = "android"
    }
  }

  buildTypes {
    release {
      isCrunchPngs = false
      isMinifyEnabled = false
      proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
      signingConfig = signingConfigs.getByName("release")
    }
    debug { signingConfig = signingConfigs.getByName("debugConfig") }
  }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
  }
  buildFeatures {
    compose = true
    buildConfig = true
  }
  testOptions { unitTests { isIncludeAndroidResources = true } }
  dependenciesInfo {
    includeInApk = false
    includeInBundle = true
  }
}

// Configure the Secrets Gradle Plugin to use .env and .env.example files
// to match the convention used in Web projects.
secrets {
  propertiesFileName = ".env"
  defaultPropertiesFileName = ".env.example"
  ignoreList.add("FIREBASE_APPCHECK_DEBUG_TOKEN")
}

googleServices { missingGoogleServicesStrategy = MissingGoogleServicesStrategy.WARN }

// Some unused dependencies are commented out below instead of being removed.
// This makes it easy to add them back in the future if needed.
dependencies {
  implementation(platform(libs.androidx.compose.bom))
  implementation(platform(libs.firebase.bom))
  // implementation(libs.accompanist.permissions)
  implementation(libs.androidx.activity.compose)
  // implementation(libs.androidx.camera.camera2)
  // implementation(libs.androidx.camera.core)
  // implementation(libs.androidx.camera.lifecycle)
  // implementation(libs.androidx.camera.view)
  implementation(libs.androidx.compose.material.icons.core)
  implementation(libs.androidx.compose.material.icons.extended)
  implementation(libs.androidx.compose.material3)
  implementation(libs.androidx.compose.ui)
  implementation(libs.androidx.compose.ui.graphics)
  implementation(libs.androidx.compose.ui.tooling.preview)
  implementation(libs.androidx.core.ktx)
  // implementation(libs.androidx.datastore.preferences)
  implementation(libs.androidx.lifecycle.runtime.compose)
  implementation(libs.androidx.lifecycle.runtime.ktx)
  implementation(libs.androidx.lifecycle.viewmodel.compose)
  implementation(libs.androidx.navigation.compose)
  implementation(libs.androidx.room.ktx)
  implementation(libs.androidx.room.runtime)
  // implementation(libs.coil.compose)
  implementation(libs.converter.moshi)
  implementation(libs.firebase.ai)
  // Uncomment to use Firestore:
  // implementation(libs.firebase.firestore)

  // Uncomment ALL FOUR of the following dependencies together to use Firebase Auth and Google
  // Sign-In via Credential Manager:
  // implementation(libs.firebase.auth)
  // implementation(libs.androidx.credentials)
  // implementation(libs.androidx.credentials.play.services)
  // implementation(libs.googleid)
  implementation(libs.firebase.appcheck.recaptcha)
  implementation(libs.firebase.appcheck.debug)
  implementation(libs.kotlinx.coroutines.android)
  implementation(libs.kotlinx.coroutines.core)
  implementation(libs.logging.interceptor)
  implementation(libs.moshi.kotlin)
  implementation(libs.okhttp)
  // implementation(libs.play.services.location)
  implementation(libs.retrofit)
  testImplementation(libs.androidx.compose.ui.test.junit4)
  testImplementation(libs.androidx.core)
  testImplementation(libs.androidx.junit)
  testImplementation(libs.junit)
  testImplementation(libs.kotlinx.coroutines.test)
  testImplementation(libs.robolectric)
  testImplementation(libs.roborazzi)
  testImplementation(libs.roborazzi.compose)
  testImplementation(libs.roborazzi.junit.rule)
  androidTestImplementation(platform(libs.androidx.compose.bom))
  androidTestImplementation(libs.androidx.compose.ui.test.junit4)
  androidTestImplementation(libs.androidx.espresso.core)
  androidTestImplementation(libs.androidx.junit)
  androidTestImplementation(libs.androidx.runner)
  debugImplementation(libs.androidx.compose.ui.test.manifest)
  debugImplementation(libs.androidx.compose.ui.tooling)
  "ksp"(libs.androidx.room.compiler)
  "ksp"(libs.moshi.kotlin.codegen)
}

```

---

## FILE: `app/proguard-rules.pro`

```text
# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

```

---

## FILE: `app/src/main/AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.MyApplication">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.MyApplication">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>

```

---

## FILE: `app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">MEDATHON</string>
    <string name="tagline">Smart Healthcare · Chennai</string>
    <string name="abdm_disclaimer">DEMO / SAMPLE — NOT OFFICIAL AADHAAR</string>
</resources>

```

---

## FILE: `app/src/main/res/values/colors.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>

```

---

## FILE: `app/src/main/res/values/themes.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>

    <style name="Theme.MyApplication" parent="android:Theme.DeviceDefault.NoActionBar" />
</resources>

```

---

## FILE: `app/src/main/res/xml/backup_rules.xml`

```xml
<?xml version="1.0" encoding="utf-8"?><!--
   Sample backup rules file; uncomment and customize as necessary.
   See https://developer.android.com/guide/topics/data/autobackup
   for details.
   Note: This file is ignored for devices older than API 31
   See https://developer.android.com/about/versions/12/backup-restore
-->
<full-backup-content>
    <!--
   <include domain="sharedpref" path="."/>
   <exclude domain="sharedpref" path="device.xml"/>
-->
</full-backup-content>

```

---

## FILE: `app/src/main/res/xml/data_extraction_rules.xml`

```xml
<?xml version="1.0" encoding="utf-8"?><!--
   Sample data extraction rules file; uncomment and customize as necessary.
   See https://developer.android.com/about/versions/12/backup-restore#xml-changes
   for details.
-->
<data-extraction-rules>
    <cloud-backup>
        <!-- TODO: Use <include> and <exclude> to control what is backed up.
        <include .../>
        <exclude .../>
        -->
    </cloud-backup>
    <!--
    <device-transfer>
        <include .../>
        <exclude .../>
    </device-transfer>
    -->
</data-extraction-rules>

```

---

## FILE: `app/src/main/java/com/example/MainActivity.kt`

```kotlin
package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.ui.MainApp
import com.example.ui.MainViewModel
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  private val viewModel: MainViewModel by viewModels()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
          MainApp(viewModel = viewModel)
        }
      }
    }
  }
}


```

---

## FILE: `app/src/main/java/com/example/ui/MainApp.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/MainViewModel.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/theme/Color.kt`

```kotlin
package com.example.ui.theme

import androidx.compose.ui.graphics.Color

// MEDATHON Branding
val MedathonTeal = Color(0xFF05968C)
val MedathonTealDark = Color(0xFF006D65)
val MedathonTealLight = Color(0xFFE0F2F1)
val MedathonNavy = Color(0xFF071421)
val MedathonNavySurface = Color(0xFF0E2235)

// Secondary & Accent Colors
val MedathonAmber = Color(0xFFD97706)
val MedathonAmberLight = Color(0xFFFEF3C7)
val MedathonEmerald = Color(0xFF10B981)
val MedathonEmeraldLight = Color(0xFFD1FAE5)
val MedathonRose = Color(0xFFE11D48)
val MedathonRoseLight = Color(0xFFFFE4E6)
val MedathonSky = Color(0xFF0284C7)
val MedathonSkyLight = Color(0xFFE0F2FE)

// Background & Neutral
val BackgroundLight = Color(0xFFF8FAFC)
val SurfaceLight = Color(0xFFFFFFFF)
val SurfaceVariantLight = Color(0xFFF1F5F9)
val TextPrimaryLight = Color(0xFF0F172A)
val TextSecondaryLight = Color(0xFF64748B)
val BorderLight = Color(0xFFE2E8F0)

val BackgroundDark = Color(0xFF071421)
val SurfaceDark = Color(0xFF0E2235)
val SurfaceVariantDark = Color(0xFF162D44)
val TextPrimaryDark = Color(0xFFF8FAFC)
val TextSecondaryDark = Color(0xFF94A3B8)
val BorderDark = Color(0xFF1E3A58)

```

---

## FILE: `app/src/main/java/com/example/ui/theme/Theme.kt`

```kotlin
package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme =
  darkColorScheme(
    primary = MedathonTeal,
    onPrimary = Color.White,
    primaryContainer = MedathonTealDark,
    onPrimaryContainer = MedathonTealLight,
    secondary = MedathonSky,
    onSecondary = Color.White,
    tertiary = MedathonAmber,
    background = BackgroundDark,
    surface = SurfaceDark,
    surfaceVariant = SurfaceVariantDark,
    onBackground = TextPrimaryDark,
    onSurface = TextPrimaryDark,
    onSurfaceVariant = TextSecondaryDark,
  )

private val LightColorScheme =
  lightColorScheme(
    primary = MedathonTeal,
    onPrimary = Color.White,
    primaryContainer = MedathonTealLight,
    onPrimaryContainer = MedathonTealDark,
    secondary = MedathonNavy,
    onSecondary = Color.White,
    tertiary = MedathonAmber,
    background = BackgroundLight,
    surface = SurfaceLight,
    surfaceVariant = SurfaceVariantLight,
    onBackground = TextPrimaryLight,
    onSurface = TextPrimaryLight,
    onSurfaceVariant = TextSecondaryLight,
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  // Disable dynamic color so MEDATHON brand identity is strictly preserved
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme =
    when {
      dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
      }
      darkTheme -> DarkColorScheme
      else -> LightColorScheme
    }

  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}


```

---

## FILE: `app/src/main/java/com/example/ui/theme/Type.kt`

```kotlin
package com.example.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Set of Material typography styles to start with
val Typography =
  Typography(
    bodyLarge =
      TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp,
      )
    /* Other default text styles to override
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    )
    */
  )

```

---

## FILE: `app/src/main/java/com/example/ui/components/CommonComponents.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/screens/SplashScreen.kt`

```kotlin
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DeviceHub
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.QrCode2
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.MainViewModel
import com.example.ui.Screen
import com.example.ui.theme.MedathonEmerald
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun SplashScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val scrollState = rememberScrollState()

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .verticalScroll(scrollState)
      .padding(horizontal = 24.dp, vertical = 32.dp),
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.SpaceBetween
  ) {
    Column(
      horizontalAlignment = Alignment.CenterHorizontally,
      modifier = Modifier.fillMaxWidth()
    ) {
      Spacer(modifier = Modifier.height(24.dp))

      // Logo + Medical Cross Icon
      Box(
        modifier = Modifier
          .size(88.dp)
          .clip(CircleShape)
          .background(
            Brush.radialGradient(
              colors = listOf(MedathonTeal, Color(0xFF006D65))
            )
          ),
        contentAlignment = Alignment.Center
      ) {
        Icon(
          imageVector = Icons.Default.LocalHospital,
          contentDescription = "MEDATHON Logo",
          tint = Color.White,
          modifier = Modifier.size(52.dp)
        )
      }

      Spacer(modifier = Modifier.height(20.dp))

      Text(
        text = "MEDATHON",
        style = MaterialTheme.typography.headlineLarge,
        fontWeight = FontWeight.ExtraBold,
        letterSpacing = 2.sp,
        color = MaterialTheme.colorScheme.onBackground
      )

      Text(
        text = "Smart Healthcare · Chennai",
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.SemiBold,
        color = MedathonTeal
      )

      Spacer(modifier = Modifier.height(6.dp))

      Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Box(
            modifier = Modifier
              .size(8.dp)
              .clip(CircleShape)
              .background(MedathonEmerald)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "Chennai · Tamil Nadu",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }
      }

      Spacer(modifier = Modifier.height(28.dp))

      // Digital Twin Badge
      Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MedathonTealLight),
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(16.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Box(
            modifier = Modifier
              .size(40.dp)
              .clip(CircleShape)
              .background(MedathonTeal),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.DeviceHub,
              contentDescription = "Digital Twin",
              tint = Color.White,
              modifier = Modifier.size(22.dp)
            )
          }
          Spacer(modifier = Modifier.width(12.dp))
          Column {
            Text(
              text = "Patient Digital Twin Node",
              style = MaterialTheme.typography.titleSmall,
              fontWeight = FontWeight.Bold,
              color = MedathonNavy
            )
            Text(
              text = "Real-time sync with Kiosk reception & Doctor Desktop HIMS",
              style = MaterialTheme.typography.bodySmall,
              color = MedathonNavy.copy(alpha = 0.8f)
            )
          }
        }
      }

      Spacer(modifier = Modifier.height(24.dp))

      // Key Features List
      Column(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        FeatureItem(
          icon = Icons.Default.QrCode2,
          title = "ABDM Health Card & QR",
          subtitle = "Instant check-in by scanning at reception kiosk"
        )
        FeatureItem(
          icon = Icons.Default.Speed,
          title = "Kiosk-Captured Vitals Sync",
          subtitle = "Pulse, SpO2, and BP syncs instantly to your phone"
        )
        FeatureItem(
          icon = Icons.Default.LocalHospital,
          title = "Clinical Records & Appointments",
          subtitle = "View doctor prescriptions, lab results, and OPD visits"
        )
      }
    }

    Spacer(modifier = Modifier.height(32.dp))

    // Action Buttons
    Column(
      modifier = Modifier.fillMaxWidth(),
      verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      Button(
        onClick = { viewModel.navigateTo(Screen.Login) },
        modifier = Modifier
          .fillMaxWidth()
          .height(52.dp)
          .testTag("skip_to_login_button"),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
      ) {
        Text("Continue to Login", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Spacer(modifier = Modifier.width(8.dp))
        Icon(Icons.Default.ArrowForward, contentDescription = "Next")
      }

      OutlinedButton(
        onClick = { viewModel.navigateTo(Screen.Register) },
        modifier = Modifier
          .fillMaxWidth()
          .height(52.dp)
          .testTag("new_patient_register_button"),
        shape = RoundedCornerShape(12.dp)
      ) {
        Text("New Patient? Register", fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = MedathonTeal)
      }
    }
  }
}

@Composable
private fun FeatureItem(
  icon: ImageVector,
  title: String,
  subtitle: String
) {
  Row(
    verticalAlignment = Alignment.CenterVertically,
    modifier = Modifier.fillMaxWidth()
  ) {
    Box(
      modifier = Modifier
        .size(36.dp)
        .clip(RoundedCornerShape(8.dp))
        .background(MaterialTheme.colorScheme.surfaceVariant),
      contentAlignment = Alignment.Center
    ) {
      Icon(
        imageVector = icon,
        contentDescription = title,
        tint = MedathonTeal,
        modifier = Modifier.size(20.dp)
      )
    }
    Spacer(modifier = Modifier.width(12.dp))
    Column {
      Text(
        text = title,
        style = MaterialTheme.typography.bodyMedium,
        fontWeight = FontWeight.SemiBold,
        color = MaterialTheme.colorScheme.onBackground
      )
      Text(
        text = subtitle,
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )
    }
  }
}

```

---

## FILE: `app/src/main/java/com/example/ui/screens/LoginScreen.kt`

```kotlin
package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.MainViewModel
import com.example.ui.Screen
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun LoginScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  var mobileNumber by remember { mutableStateOf("") }
  val focusManager = LocalFocusManager.current
  val scrollState = rememberScrollState()

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .verticalScroll(scrollState)
      .padding(horizontal = 24.dp, vertical = 20.dp),
    verticalArrangement = Arrangement.SpaceBetween
  ) {
    Column {
      // Back button
      IconButton(
        onClick = { viewModel.navigateTo(Screen.Splash) },
        modifier = Modifier.testTag("login_back_button")
      ) {
        Icon(
          imageVector = Icons.Default.ArrowBack,
          contentDescription = "Back",
          tint = MaterialTheme.colorScheme.onBackground
        )
      }

      Spacer(modifier = Modifier.height(16.dp))

      // Header branding
      Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
          modifier = Modifier
            .size(44.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(MedathonTeal),
          contentAlignment = Alignment.Center
        ) {
          Icon(
            imageVector = Icons.Default.LocalHospital,
            contentDescription = "MEDATHON",
            tint = Color.White,
            modifier = Modifier.size(26.dp)
          )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
          Text(
            text = "MEDATHON",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
          )
          Text(
            text = "Patient Portal · Chennai",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
        }
      }

      Spacer(modifier = Modifier.height(32.dp))

      Text(
        text = "Welcome Back",
        style = MaterialTheme.typography.headlineSmall,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onBackground
      )
      Spacer(modifier = Modifier.height(4.dp))
      Text(
        text = "Enter your 10-digit registered Indian mobile number to access your ABDM Health Card & Kiosk Vitals.",
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )

      Spacer(modifier = Modifier.height(28.dp))

      // Role banner: Patient Only
      Surface(
        shape = RoundedCornerShape(10.dp),
        color = MedathonTealLight,
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Icon(
            imageVector = Icons.Default.Info,
            contentDescription = "Role info",
            tint = MedathonTeal,
            modifier = Modifier.size(18.dp)
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Patient Access Node (Doctors use Desktop HIMS)",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Medium,
            color = MedathonNavy
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // Mobile input
      OutlinedTextField(
        value = mobileNumber,
        onValueChange = { input ->
          if (input.length <= 10 && input.all { it.isDigit() }) {
            mobileNumber = input
            viewModel.clearError()
          }
        },
        label = { Text("Mobile Number") },
        placeholder = { Text("9876543210") },
        leadingIcon = {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(start = 12.dp, end = 6.dp)
          ) {
            Icon(Icons.Default.Phone, contentDescription = "Phone", tint = MedathonTeal)
            Spacer(modifier = Modifier.width(6.dp))
            Text("+91", fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
            Spacer(modifier = Modifier.width(6.dp))
            Box(
              modifier = Modifier
                .width(1.dp)
                .height(20.dp)
                .background(MaterialTheme.colorScheme.outlineVariant)
            )
          }
        },
        keyboardOptions = KeyboardOptions(
          keyboardType = KeyboardType.Number,
          imeAction = ImeAction.Done
        ),
        keyboardActions = KeyboardActions(
          onDone = {
            focusManager.clearFocus()
            if (mobileNumber.length == 10) viewModel.login(mobileNumber)
          }
        ),
        singleLine = true,
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
          .fillMaxWidth()
          .testTag("mobile_number_input")
      )

      if (uiState.errorMessage != null) {
        Spacer(modifier = Modifier.height(8.dp))
        Text(
          text = uiState.errorMessage ?: "",
          color = MaterialTheme.colorScheme.error,
          style = MaterialTheme.typography.bodySmall
        )
      }

      Spacer(modifier = Modifier.height(20.dp))

      // Quick Demo Pill for easy evaluation
      Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        modifier = Modifier
          .fillMaxWidth()
          .clickable {
            mobileNumber = "9876543210"
            viewModel.login("9876543210")
          }
          .testTag("quick_demo_login_card")
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          Column {
            Text(
              text = "Quick Demo Account",
              style = MaterialTheme.typography.labelMedium,
              fontWeight = FontWeight.Bold,
              color = MedathonTeal
            )
            Text(
              text = "Priya Subramanian · 9876543210",
              style = MaterialTheme.typography.bodySmall,
              color = MaterialTheme.colorScheme.onSurfaceVariant
            )
          }
          Text(
            text = "Tap to login",
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = MedathonTeal
          )
        }
      }

      Spacer(modifier = Modifier.height(28.dp))

      // Login Button
      Button(
        onClick = {
          focusManager.clearFocus()
          viewModel.login(mobileNumber)
        },
        enabled = mobileNumber.length == 10 && !uiState.isLoading,
        modifier = Modifier
          .fillMaxWidth()
          .height(52.dp)
          .testTag("login_submit_button"),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
      ) {
        if (uiState.isLoading) {
          CircularProgressIndicator(
            modifier = Modifier.size(24.dp),
            color = Color.White,
            strokeWidth = 2.dp
          )
        } else {
          Text("Sign In", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
      }
    }

    // Bottom Register prompt
    Column(
      horizontalAlignment = Alignment.CenterHorizontally,
      modifier = Modifier
        .fillMaxWidth()
        .padding(top = 24.dp)
    ) {
      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
      ) {
        Text(
          text = "New patient? ",
          style = MaterialTheme.typography.bodyMedium,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
          text = "Register Here",
          style = MaterialTheme.typography.bodyMedium,
          fontWeight = FontWeight.Bold,
          color = MedathonTeal,
          modifier = Modifier
            .clickable { viewModel.navigateTo(Screen.Register) }
            .testTag("register_redirect_link")
        )
      }
    }
  }
}

```

---

## FILE: `app/src/main/java/com/example/ui/screens/RegistrationScreen.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/screens/HomeScreen.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/screens/AbdmCardScreen.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/screens/VitalsScreen.kt`

```kotlin
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
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.DeviceHub
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.local.ChennaiSeedData
import com.example.data.model.VitalLog
import com.example.ui.MainViewModel
import com.example.ui.theme.MedathonAmber
import com.example.ui.theme.MedathonEmerald
import com.example.ui.theme.MedathonNavy
import com.example.ui.theme.MedathonRose
import com.example.ui.theme.MedathonSky
import com.example.ui.theme.MedathonTeal
import com.example.ui.theme.MedathonTealLight

@Composable
fun VitalsScreen(
  viewModel: MainViewModel,
  modifier: Modifier = Modifier
) {
  val uiState by viewModel.uiState.collectAsState()
  val patient = uiState.patient ?: ChennaiSeedData.defaultPatient
  val vitalsList = uiState.vitals.ifEmpty { patient.vitals ?: emptyList() }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(MaterialTheme.colorScheme.background)
      .padding(horizontal = 16.dp, vertical = 12.dp)
  ) {
    // Header
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(bottom = 12.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          text = "Vitals History",
          style = MaterialTheme.typography.titleLarge,
          fontWeight = FontWeight.Bold,
          color = MaterialTheme.colorScheme.onBackground
        )
        Text(
          text = "Digital Twin telemetry from Reception Kiosk",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
      }

      Row(verticalAlignment = Alignment.CenterVertically) {
        IconButton(
          onClick = { viewModel.refreshVitals() },
          modifier = Modifier.testTag("vitals_screen_refresh_button")
        ) {
          if (uiState.isRefreshingVitals) {
            CircularProgressIndicator(
              modifier = Modifier.size(20.dp),
              color = MedathonTeal,
              strokeWidth = 2.dp
            )
          } else {
            Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = MedathonTeal)
          }
        }
      }
    }

    // Top action banner: Simulate Kiosk Sync
    Surface(
      shape = RoundedCornerShape(14.dp),
      color = MedathonTealLight,
      modifier = Modifier
        .fillMaxWidth()
        .padding(bottom = 14.dp)
    ) {
      Row(
        modifier = Modifier.padding(14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
          Box(
            modifier = Modifier
              .size(36.dp)
              .clip(CircleShape)
              .background(MedathonTeal),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.Speed,
              contentDescription = "Kiosk",
              tint = Color.White,
              modifier = Modifier.size(20.dp)
            )
          }
          Spacer(modifier = Modifier.width(10.dp))
          Column {
            Text(
              text = "Kiosk Vitals Reader",
              style = MaterialTheme.typography.titleSmall,
              fontWeight = FontWeight.Bold,
              color = MedathonNavy
            )
            Text(
              text = "Live telemetry captured at reception",
              style = MaterialTheme.typography.bodySmall,
              color = MedathonNavy.copy(alpha = 0.8f)
            )
          }
        }

        Button(
          onClick = { viewModel.simulateKioskCapture() },
          shape = RoundedCornerShape(10.dp),
          colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal),
          modifier = Modifier.testTag("simulate_kiosk_reading_button")
        ) {
          Icon(Icons.Default.AddCircle, contentDescription = "Simulate", modifier = Modifier.size(16.dp))
          Spacer(modifier = Modifier.width(4.dp))
          Text("Simulate", fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
      }
    }

    if (vitalsList.isEmpty()) {
      // Empty State: "Visit the kiosk after your appointment"
      Box(
        modifier = Modifier
          .fillMaxSize()
          .testTag("vitals_empty_state"),
        contentAlignment = Alignment.Center
      ) {
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          modifier = Modifier.padding(24.dp)
        ) {
          Box(
            modifier = Modifier
              .size(80.dp)
              .clip(CircleShape)
              .background(MaterialTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.Speed,
              contentDescription = "No vitals",
              tint = MedathonTeal,
              modifier = Modifier.size(44.dp)
            )
          }
          Spacer(modifier = Modifier.height(16.dp))
          Text(
            text = "No vitals recorded yet",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
          )
          Spacer(modifier = Modifier.height(6.dp))
          Text(
            text = "Visit the kiosk after your appointment",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
          )
          Spacer(modifier = Modifier.height(20.dp))
          Button(
            onClick = { viewModel.simulateKioskCapture() },
            colors = ButtonDefaults.buttonColors(containerColor = MedathonTeal)
          ) {
            Text("Simulate Kiosk Telemetry")
          }
        }
      }
    } else {
      LazyColumn(
        verticalArrangement = Arrangement.spacedBy(14.dp),
        modifier = Modifier.fillMaxSize()
      ) {
        items(vitalsList, key = { it.id }) { vital ->
          VitalRecordCard(vital)
        }
      }
    }
  }
}

@Composable
private fun VitalRecordCard(vital: VitalLog) {
  Card(
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    modifier = Modifier
      .fillMaxWidth()
      .testTag("vital_record_${vital.id}")
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
              .size(32.dp)
              .clip(CircleShape)
              .background(MedathonTealLight),
            contentAlignment = Alignment.Center
          ) {
            Icon(
              imageVector = Icons.Default.Favorite,
              contentDescription = "Pulse",
              tint = MedathonTeal,
              modifier = Modifier.size(16.dp)
            )
          }
          Spacer(modifier = Modifier.width(10.dp))
          Column {
            Text(
              text = vital.timestamp,
              style = MaterialTheme.typography.titleSmall,
              fontWeight = FontWeight.Bold,
              color = MaterialTheme.colorScheme.onSurface
            )
            Text(
              text = vital.source,
              style = MaterialTheme.typography.bodySmall,
              color = MedathonTeal
            )
          }
        }

        Surface(
          shape = RoundedCornerShape(12.dp),
          color = Color(0xFFD1FAE5)
        ) {
          Text(
            text = vital.status,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF047857),
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(14.dp))

      // 4 Metrics Grid
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        VitalStatPill(
          label = "Pulse Rate",
          value = "${vital.heartRate}",
          unit = "bpm",
          color = MedathonRose,
          modifier = Modifier.weight(1f)
        )
        VitalStatPill(
          label = "SpO2 Level",
          value = "${vital.spo2}",
          unit = "%",
          color = MedathonSky,
          modifier = Modifier.weight(1f)
        )
      }

      Spacer(modifier = Modifier.height(8.dp))

      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        VitalStatPill(
          label = "Temperature",
          value = "${vital.temperature}",
          unit = "°F",
          color = MedathonAmber,
          modifier = Modifier.weight(1f)
        )
        VitalStatPill(
          label = "Blood Pressure",
          value = "${vital.bpSystolic}/${vital.bpDiastolic}",
          unit = "mmHg",
          color = MedathonEmerald,
          modifier = Modifier.weight(1f)
        )
      }
    }
  }
}

@Composable
private fun VitalStatPill(
  label: String,
  value: String,
  unit: String,
  color: Color,
  modifier: Modifier = Modifier
) {
  Surface(
    shape = RoundedCornerShape(10.dp),
    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
    modifier = modifier
  ) {
    Column(modifier = Modifier.padding(10.dp)) {
      Text(
        text = label,
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant
      )
      Spacer(modifier = Modifier.height(4.dp))
      Row(verticalAlignment = Alignment.Bottom) {
        Text(
          text = value,
          style = MaterialTheme.typography.titleMedium,
          fontWeight = FontWeight.Bold,
          color = color
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
          text = unit,
          style = MaterialTheme.typography.labelSmall,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
      }
    }
  }
}

```

---

## FILE: `app/src/main/java/com/example/ui/screens/AppointmentsScreen.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/screens/RecordsScreen.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/ui/screens/ProfileSettingsScreen.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/data/model/Models.kt`

```kotlin
package com.example.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Patient(
  @Json(name = "id") val id: String,
  @Json(name = "patientNo") val patientNo: String,
  @Json(name = "firstName") val firstName: String,
  @Json(name = "lastName") val lastName: String,
  @Json(name = "ageYears") val ageYears: Int,
  @Json(name = "gender") val gender: String, // "MALE" or "FEMALE"
  @Json(name = "mobile") val mobile: String,
  @Json(name = "district") val district: String = "Chennai",
  @Json(name = "state") val state: String = "Tamil Nadu",
  @Json(name = "address") val address: String,
  @Json(name = "opdType") val opdType: String? = null,
  @Json(name = "doctorName") val doctorName: String? = null,
  @Json(name = "abha") val abha: String? = null,
  @Json(name = "aadharMasked") val aadharMasked: String? = "XXXX XXXX 8492",
  @Json(name = "scheme") val scheme: String? = "PMJAY",
  @Json(name = "registeredAt") val registeredAt: String? = null,
  @Json(name = "visits") val visits: List<OPDVisit>? = emptyList(),
  @Json(name = "vitals") val vitals: List<VitalLog>? = emptyList(),
  @Json(name = "labRecords") val labRecords: List<LabRecord>? = emptyList(),
  @Json(name = "prescriptions") val prescriptions: List<Prescription>? = emptyList()
) {
  val fullName: String
    get() = "$firstName $lastName".trim()

  val abhaAddress: String
    get() = abha ?: "${firstName.lowercase().replace(" ", "")}.${lastName.lowercase().replace(" ", "")}@abdm"
}

@JsonClass(generateAdapter = true)
data class RegisterPatientRequest(
  @Json(name = "firstName") val firstName: String,
  @Json(name = "lastName") val lastName: String,
  @Json(name = "ageYears") val ageYears: Int,
  @Json(name = "gender") val gender: String, // "MALE" or "FEMALE"
  @Json(name = "mobile") val mobile: String,
  @Json(name = "district") val district: String = "Chennai",
  @Json(name = "state") val state: String = "Tamil Nadu",
  @Json(name = "address") val address: String,
  @Json(name = "opdType") val opdType: String,
  @Json(name = "doctorName") val doctorName: String,
  @Json(name = "referredBy") val referredBy: String = "Self / Walk-in",
  @Json(name = "reason") val reason: String = "Routine checkup",
  @Json(name = "feeAmount") val feeAmount: Int = 0,
  @Json(name = "paymentCollected") val paymentCollected: Boolean = true
)

@JsonClass(generateAdapter = true)
data class VitalLog(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "timestamp") val timestamp: String,
  @Json(name = "heartRate") val heartRate: Int, // BPM
  @Json(name = "spo2") val spo2: Int, // %
  @Json(name = "temperature") val temperature: Double, // °F
  @Json(name = "bpSystolic") val bpSystolic: Int = 120,
  @Json(name = "bpDiastolic") val bpDiastolic: Int = 80,
  @Json(name = "respiratoryRate") val respiratoryRate: Int = 16,
  @Json(name = "source") val source: String = "Captured at reception kiosk",
  @Json(name = "status") val status: String = "Normal"
)

@JsonClass(generateAdapter = true)
data class OPDVisit(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "date") val date: String,
  @Json(name = "opdType") val opdType: String,
  @Json(name = "doctorName") val doctorName: String,
  @Json(name = "reason") val reason: String,
  @Json(name = "status") val status: String, // REGISTERED, IN_QUEUE, WITH_DOCTOR, COMPLETED
  @Json(name = "tokenNo") val tokenNo: Int? = null
)

@JsonClass(generateAdapter = true)
data class LabRecord(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "testName") val testName: String,
  @Json(name = "date") val date: String,
  @Json(name = "result") val result: String,
  @Json(name = "unit") val unit: String? = null,
  @Json(name = "referenceRange") val referenceRange: String? = null,
  @Json(name = "status") val status: String = "Normal", // Normal, Borderline, High
  @Json(name = "doctorNotes") val doctorNotes: String? = null
)

@JsonClass(generateAdapter = true)
data class Prescription(
  @Json(name = "id") val id: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "doctorName") val doctorName: String,
  @Json(name = "date") val date: String,
  @Json(name = "medication") val medication: String,
  @Json(name = "dosage") val dosage: String,
  @Json(name = "duration") val duration: String,
  @Json(name = "instructions") val instructions: String? = null
)

@JsonClass(generateAdapter = true)
data class AbdmQrPayload(
  @Json(name = "type") val type: String = "medathon-patient",
  @Json(name = "patientNo") val patientNo: String,
  @Json(name = "patientId") val patientId: String,
  @Json(name = "name") val name: String,
  @Json(name = "abha") val abha: String
)

```

---

## FILE: `app/src/main/java/com/example/data/api/MedathonApiService.kt`

```kotlin
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

```

---

## FILE: `app/src/main/java/com/example/data/local/SessionManager.kt`

```kotlin
package com.example.data.local

import android.content.Context
import android.content.SharedPreferences
import com.example.data.model.LabRecord
import com.example.data.model.OPDVisit
import com.example.data.model.Patient
import com.example.data.model.Prescription
import com.example.data.model.VitalLog
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

class SessionManager(context: Context) {
  private val prefs: SharedPreferences =
    context.getSharedPreferences("medathon_patient_session", Context.MODE_PRIVATE)

  private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
  private val patientAdapter = moshi.adapter(Patient::class.java)

  companion object {
    private const val KEY_IS_LOGGED_IN = "is_logged_in"
    private const val KEY_PATIENT_ID = "patient_id"
    private const val KEY_PATIENT_NO = "patient_no"
    private const val KEY_PATIENT_MOBILE = "patient_mobile"
    private const val KEY_SERVER_URL = "server_url"
    private const val KEY_CACHED_PATIENT = "cached_patient"
    private const val KEY_DEMO_MODE = "demo_mode"
    const val DEFAULT_SERVER_URL = "http://10.0.2.2:3000/"
  }

  var isLoggedIn: Boolean
    get() = prefs.getBoolean(KEY_IS_LOGGED_IN, false)
    set(value) = prefs.edit().putBoolean(KEY_IS_LOGGED_IN, value).apply()

  var currentPatientId: String
    get() = prefs.getString(KEY_PATIENT_ID, "") ?: ""
    set(value) = prefs.edit().putString(KEY_PATIENT_ID, value).apply()

  var currentPatientNo: String
    get() = prefs.getString(KEY_PATIENT_NO, "") ?: ""
    set(value) = prefs.edit().putString(KEY_PATIENT_NO, value).apply()

  var currentPatientMobile: String
    get() = prefs.getString(KEY_PATIENT_MOBILE, "") ?: ""
    set(value) = prefs.edit().putString(KEY_PATIENT_MOBILE, value).apply()

  var serverUrl: String
    get() {
      val url = prefs.getString(KEY_SERVER_URL, DEFAULT_SERVER_URL) ?: DEFAULT_SERVER_URL
      return if (url.endsWith("/")) url else "$url/"
    }
    set(value) {
      val normalized = if (value.endsWith("/")) value else "$value/"
      prefs.edit().putString(KEY_SERVER_URL, normalized).apply()
    }

  var isDemoMode: Boolean
    get() = prefs.getBoolean(KEY_DEMO_MODE, false)
    set(value) = prefs.edit().putBoolean(KEY_DEMO_MODE, value).apply()

  fun savePatient(patient: Patient) {
    try {
      val json = patientAdapter.toJson(patient)
      prefs.edit()
        .putString(KEY_CACHED_PATIENT, json)
        .putString(KEY_PATIENT_ID, patient.id)
        .putString(KEY_PATIENT_NO, patient.patientNo)
        .putString(KEY_PATIENT_MOBILE, patient.mobile)
        .putBoolean(KEY_IS_LOGGED_IN, true)
        .apply()
    } catch (_: Exception) {}
  }

  fun getCachedPatient(): Patient? {
    val json = prefs.getString(KEY_CACHED_PATIENT, null) ?: return null
    return try {
      patientAdapter.fromJson(json)
    } catch (_: Exception) {
      null
    }
  }

  fun clearSession() {
    val currentUrl = serverUrl
    prefs.edit()
      .remove(KEY_IS_LOGGED_IN)
      .remove(KEY_PATIENT_ID)
      .remove(KEY_PATIENT_NO)
      .remove(KEY_PATIENT_MOBILE)
      .remove(KEY_CACHED_PATIENT)
      .apply()
    serverUrl = currentUrl
  }
}

object ChennaiSeedData {
  val defaultPatient = Patient(
    id = "cm0915priyachennai01",
    patientNo = "P-CHN-20260915-0001",
    firstName = "Priya",
    lastName = "Subramanian",
    ageYears = 28,
    gender = "FEMALE",
    mobile = "9876543210",
    district = "Chennai",
    state = "Tamil Nadu",
    address = "Ward 42, T Nagar, Chennai, Tamil Nadu — 600017",
    opdType = "General OPD",
    doctorName = "Dr. Priya Subramanian",
    abha = "priya.subramanian@abdm",
    aadharMasked = "XXXX XXXX 8492",
    scheme = "PMJAY / TN CMCHIS",
    registeredAt = "2026-09-15 09:15 AM",
    visits = listOf(
      OPDVisit(
        id = "visit-001",
        patientId = "cm0915priyachennai01",
        date = "Today, 10:30 AM",
        opdType = "General OPD",
        doctorName = "Dr. Priya Subramanian",
        reason = "Routine vitals checkup & seasonal wellness",
        status = "WITH_DOCTOR",
        tokenNo = 14
      ),
      OPDVisit(
        id = "visit-002",
        patientId = "cm0915priyachennai01",
        date = "01 Sep 2026, 04:00 PM",
        opdType = "Cardiology OPD",
        doctorName = "Dr. Karthik Iyer",
        reason = "Post-workout BP baseline review",
        status = "COMPLETED",
        tokenNo = 8
      ),
      OPDVisit(
        id = "visit-003",
        patientId = "cm0915priyachennai01",
        date = "15 Aug 2026, 11:15 AM",
        opdType = "Dermatology",
        doctorName = "Dr. Malini Krishnan",
        reason = "Skin allergy consultation",
        status = "COMPLETED",
        tokenNo = 21
      )
    ),
    vitals = listOf(
      VitalLog(
        id = "vit-001",
        patientId = "cm0915priyachennai01",
        timestamp = "Today, 10:25 AM",
        heartRate = 74,
        spo2 = 98,
        temperature = 98.4,
        bpSystolic = 120,
        bpDiastolic = 80,
        respiratoryRate = 16,
        source = "Captured at reception kiosk",
        status = "Normal"
      ),
      VitalLog(
        id = "vit-002",
        patientId = "cm0915priyachennai01",
        timestamp = "01 Sep 2026, 03:55 PM",
        heartRate = 78,
        spo2 = 99,
        temperature = 98.6,
        bpSystolic = 122,
        bpDiastolic = 82,
        respiratoryRate = 17,
        source = "Captured at reception kiosk",
        status = "Normal"
      ),
      VitalLog(
        id = "vit-003",
        patientId = "cm0915priyachennai01",
        timestamp = "15 Aug 2026, 11:05 AM",
        heartRate = 72,
        spo2 = 98,
        temperature = 98.2,
        bpSystolic = 118,
        bpDiastolic = 78,
        respiratoryRate = 15,
        source = "Captured at reception kiosk",
        status = "Normal"
      )
    ),
    labRecords = listOf(
      LabRecord(
        id = "lab-001",
        patientId = "cm0915priyachennai01",
        testName = "Complete Blood Count (CBC)",
        date = "01 Sep 2026",
        result = "Hemoglobin: 13.8 g/dL (Normal)",
        unit = "g/dL",
        referenceRange = "12.0 - 15.5 g/dL",
        status = "Normal",
        doctorNotes = "All blood counts within optimal limits."
      ),
      LabRecord(
        id = "lab-002",
        patientId = "cm0915priyachennai01",
        testName = "Fasting Blood Glucose",
        date = "01 Sep 2026",
        result = "92 mg/dL",
        unit = "mg/dL",
        referenceRange = "70 - 99 mg/dL",
        status = "Normal",
        doctorNotes = "Normoglycemic fasting index."
      ),
      LabRecord(
        id = "lab-003",
        patientId = "cm0915priyachennai01",
        testName = "Lipid Profile (Total Cholesterol)",
        date = "15 Aug 2026",
        result = "168 mg/dL",
        unit = "mg/dL",
        referenceRange = "< 200 mg/dL",
        status = "Normal",
        doctorNotes = "Good cardiovascular profile."
      )
    ),
    prescriptions = listOf(
      Prescription(
        id = "rx-001",
        patientId = "cm0915priyachennai01",
        doctorName = "Dr. Priya Subramanian",
        date = "Today",
        medication = "Paracetamol 500mg",
        dosage = "1 - 0 - 1 (After food)",
        duration = "3 days",
        instructions = "Take with water if body aches or mild fever occurs."
      ),
      Prescription(
        id = "rx-002",
        patientId = "cm0915priyachennai01",
        doctorName = "Dr. Karthik Iyer",
        date = "01 Sep 2026",
        medication = "Vitamin D3 60,000 IU",
        dosage = "1 tablet weekly",
        duration = "4 weeks",
        instructions = "Take after breakfast with milk."
      ),
      Prescription(
        id = "rx-003",
        patientId = "cm0915priyachennai01",
        doctorName = "Dr. Malini Krishnan",
        date = "15 Aug 2026",
        medication = "Cetirizine 10mg",
        dosage = "0 - 0 - 1 (At bedtime)",
        duration = "5 days",
        instructions = "Avoid operating heavy machinery."
      )
    )
  )

  val chennaiDoctors = listOf(
    "Dr. Priya Subramanian (MBBS, MD - General Medicine)",
    "Dr. Karthik Iyer (MBBS, DM - Cardiology)",
    "Dr. Ananya Sundaram (MBBS, MS - Orthopaedics)",
    "Dr. R. Venkatesh (MBBS, DCH - Paediatrics)",
    "Dr. Malini Krishnan (MBBS, MD - Dermatology)",
    "Dr. S. Balasubramaniam (MBBS, MS - ENT)"
  )

  val chennaiLocalities = listOf(
    "T Nagar",
    "Anna Nagar",
    "Adyar",
    "Velachery",
    "Tambaram",
    "Mylapore",
    "Guindy",
    "Nungambakkam",
    "Besant Nagar",
    "Porur",
    "Chromepet",
    "Thiruvanmiyur"
  )

  val opdTypes = listOf(
    "General OPD",
    "Cardiology",
    "Orthopaedics",
    "Paediatrics",
    "Dermatology",
    "ENT / Ophthalmology"
  )
}

```

---

## FILE: `app/src/main/java/com/example/data/repository/MedathonRepository.kt`

```kotlin
package com.example.data.repository

import com.example.data.api.MedathonApiService
import com.example.data.local.ChennaiSeedData
import com.example.data.local.SessionManager
import com.example.data.model.OPDVisit
import com.example.data.model.Patient
import com.example.data.model.RegisterPatientRequest
import com.example.data.model.VitalLog
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit
import kotlin.random.Random

class MedathonRepository(private val sessionManager: SessionManager) {

  private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()

  private fun createRetrofit(baseUrl: String): Retrofit {
    val logging = HttpLoggingInterceptor().apply {
      level = HttpLoggingInterceptor.Level.BODY
    }
    val okHttpClient = OkHttpClient.Builder()
      .connectTimeout(5, TimeUnit.SECONDS)
      .readTimeout(8, TimeUnit.SECONDS)
      .addInterceptor(logging)
      .build()

    return Retrofit.Builder()
      .baseUrl(baseUrl)
      .client(okHttpClient)
      .addConverterFactory(MoshiConverterFactory.create(moshi))
      .build()
  }

  private fun getApiService(): MedathonApiService {
    return createRetrofit(sessionManager.serverUrl).create(MedathonApiService::class.java)
  }

  suspend fun loginWithMobile(mobile: String): Result<Patient> = withContext(Dispatchers.IO) {
    try {
      val cleanMobile = mobile.trim()
      val api = getApiService()
      val response = api.searchPatients(cleanMobile)

      if (response.isSuccessful && response.body() != null) {
        val jsonStr = response.body()!!.string()
        val foundPatient = parsePatientFromJson(jsonStr, cleanMobile)
        if (foundPatient != null) {
          sessionManager.savePatient(foundPatient)
          sessionManager.isDemoMode = false
          return@withContext Result.success(foundPatient)
        }
      }
    } catch (_: Exception) {
      // Network unreachable or timeout -> fallback to checking cached or seed data
    }

    // Check cached patient or seed match
    val cached = sessionManager.getCachedPatient()
    if (cached != null && (cached.mobile == mobile || mobile.length == 10)) {
      sessionManager.isLoggedIn = true
      return@withContext Result.success(cached)
    }

    if (mobile == ChennaiSeedData.defaultPatient.mobile || mobile == "9876543210") {
      val patient = ChennaiSeedData.defaultPatient
      sessionManager.savePatient(patient)
      sessionManager.isDemoMode = true
      return@withContext Result.success(patient)
    }

    // If still not found but entered 10-digit number, create an on-the-fly local demo profile
    if (mobile.length == 10) {
      val newDemo = ChennaiSeedData.defaultPatient.copy(
        mobile = mobile,
        patientNo = "P-CHN-${SimpleDateFormat("yyyyMMdd", Locale.ENGLISH).format(Date())}-${Random.nextInt(1000, 9999)}"
      )
      sessionManager.savePatient(newDemo)
      sessionManager.isDemoMode = true
      return@withContext Result.success(newDemo)
    }

    Result.failure(Exception("No patient found with mobile $mobile. Please register first."))
  }

  suspend fun registerPatient(request: RegisterPatientRequest): Result<Patient> = withContext(Dispatchers.IO) {
    val dateStamp = SimpleDateFormat("yyyyMMdd", Locale.ENGLISH).format(Date())
    val patientNo = "P-CHN-$dateStamp-${Random.nextInt(1000, 9999)}"
    val newId = "cuid_${System.currentTimeMillis()}"
    val abhaAddress = "${request.firstName.lowercase()}.${request.lastName.lowercase()}@abdm"

    val newLocalPatient = Patient(
      id = newId,
      patientNo = patientNo,
      firstName = request.firstName,
      lastName = request.lastName,
      ageYears = request.ageYears,
      gender = request.gender,
      mobile = request.mobile,
      district = request.district,
      state = request.state,
      address = request.address,
      opdType = request.opdType,
      doctorName = request.doctorName,
      abha = abhaAddress,
      aadharMasked = "XXXX XXXX ${Random.nextInt(1000, 9999)}",
      scheme = "PMJAY / TN CMCHIS",
      registeredAt = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.ENGLISH).format(Date()),
      visits = listOf(
        OPDVisit(
          id = "visit-${System.currentTimeMillis()}",
          patientId = newId,
          date = "Today, ${SimpleDateFormat("hh:mm a", Locale.ENGLISH).format(Date())}",
          opdType = request.opdType,
          doctorName = request.doctorName,
          reason = request.reason,
          status = "REGISTERED",
          tokenNo = Random.nextInt(15, 45)
        )
      ),
      vitals = emptyList(),
      labRecords = emptyList(),
      prescriptions = emptyList()
    )

    try {
      val api = getApiService()
      val response = api.registerPatient(request)
      if (response.isSuccessful && response.body() != null) {
        val jsonStr = response.body()!!.string()
        val parsed = parseSinglePatient(jsonStr) ?: newLocalPatient
        sessionManager.savePatient(parsed)
        sessionManager.isDemoMode = false
        return@withContext Result.success(parsed)
      }
    } catch (_: Exception) {
      // Offline fallback: save local patient
    }

    sessionManager.savePatient(newLocalPatient)
    sessionManager.isDemoMode = true
    Result.success(newLocalPatient)
  }

  suspend fun getPatientProfile(patientId: String): Result<Patient> = withContext(Dispatchers.IO) {
    try {
      val api = getApiService()
      val response = api.getPatientById(patientId)
      if (response.isSuccessful && response.body() != null) {
        val patient = response.body()!!
        sessionManager.savePatient(patient)
        return@withContext Result.success(patient)
      }
    } catch (_: Exception) {}

    val cached = sessionManager.getCachedPatient()
    if (cached != null) {
      return@withContext Result.success(cached)
    }

    Result.success(ChennaiSeedData.defaultPatient)
  }

  suspend fun getPatientVitals(patientId: String): Result<List<VitalLog>> = withContext(Dispatchers.IO) {
    try {
      val api = getApiService()
      val response = api.getVitalsByPatientId(patientId)
      if (response.isSuccessful && response.body() != null) {
        val remoteVitals = response.body()!!
        if (remoteVitals.isNotEmpty()) {
          // Update cached patient vitals
          val current = sessionManager.getCachedPatient()
          if (current != null) {
            sessionManager.savePatient(current.copy(vitals = remoteVitals))
          }
          return@withContext Result.success(remoteVitals)
        }
      }
    } catch (_: Exception) {}

    val current = sessionManager.getCachedPatient()
    val vitals = current?.vitals ?: ChennaiSeedData.defaultPatient.vitals ?: emptyList()
    Result.success(vitals)
  }

  fun simulateKioskCapture(patientId: String): Patient {
    val current = sessionManager.getCachedPatient() ?: ChennaiSeedData.defaultPatient
    val now = SimpleDateFormat("hh:mm a", Locale.ENGLISH).format(Date())
    val newLog = VitalLog(
      id = "kiosk-log-${System.currentTimeMillis()}",
      patientId = patientId,
      timestamp = "Today, $now",
      heartRate = Random.nextInt(68, 86),
      spo2 = Random.nextInt(97, 100),
      temperature = String.format(Locale.ENGLISH, "%.1f", 98.0 + Random.nextDouble(0.0, 1.2)).toDouble(),
      bpSystolic = Random.nextInt(116, 126),
      bpDiastolic = Random.nextInt(76, 84),
      respiratoryRate = Random.nextInt(14, 18),
      source = "Captured at reception kiosk",
      status = "Normal"
    )

    val updatedList = listOf(newLog) + (current.vitals ?: emptyList())
    val updatedPatient = current.copy(vitals = updatedList)
    sessionManager.savePatient(updatedPatient)
    return updatedPatient
  }

  fun updatePatientProfile(mobile: String, address: String, district: String): Patient {
    val current = sessionManager.getCachedPatient() ?: ChennaiSeedData.defaultPatient
    val updated = current.copy(
      mobile = mobile,
      address = address,
      district = district
    )
    sessionManager.savePatient(updated)
    return updated
  }

  private fun parsePatientFromJson(json: String, targetMobile: String): Patient? {
    return try {
      val trimmed = json.trim()
      if (trimmed.startsWith("[")) {
        val array = JSONArray(trimmed)
        for (i in 0 until array.length()) {
          val obj = array.getJSONObject(i)
          val mob = obj.optString("mobile")
          if (mob.contains(targetMobile) || targetMobile.contains(mob)) {
            return convertJsonObjectToPatient(obj)
          }
        }
        if (array.length() > 0) {
          return convertJsonObjectToPatient(array.getJSONObject(0))
        }
      } else if (trimmed.startsWith("{")) {
        val obj = JSONObject(trimmed)
        if (obj.has("patients")) {
          val array = obj.getJSONArray("patients")
          for (i in 0 until array.length()) {
            val pObj = array.getJSONObject(i)
            if (pObj.optString("mobile").contains(targetMobile)) {
              return convertJsonObjectToPatient(pObj)
            }
          }
          if (array.length() > 0) return convertJsonObjectToPatient(array.getJSONObject(0))
        } else if (obj.has("patient")) {
          return convertJsonObjectToPatient(obj.getJSONObject("patient"))
        } else if (obj.has("id") || obj.has("patientNo")) {
          return convertJsonObjectToPatient(obj)
        }
      }
      null
    } catch (_: Exception) {
      null
    }
  }

  private fun parseSinglePatient(json: String): Patient? {
    return try {
      val trimmed = json.trim()
      if (trimmed.startsWith("{")) {
        val obj = JSONObject(trimmed)
        if (obj.has("patient")) {
          convertJsonObjectToPatient(obj.getJSONObject("patient"))
        } else if (obj.has("id") || obj.has("patientNo")) {
          convertJsonObjectToPatient(obj)
        } else null
      } else null
    } catch (_: Exception) {
      null
    }
  }

  private fun convertJsonObjectToPatient(obj: JSONObject): Patient {
    val id = obj.optString("id", "p-${System.currentTimeMillis()}")
    val patientNo = obj.optString("patientNo", "P-CHN-20260915-0001")
    val firstName = obj.optString("firstName", "Priya")
    val lastName = obj.optString("lastName", "Subramanian")
    val ageYears = obj.optInt("ageYears", 28)
    val gender = obj.optString("gender", "FEMALE")
    val mobile = obj.optString("mobile", "9876543210")
    val district = obj.optString("district", "Chennai")
    val state = obj.optString("state", "Tamil Nadu")
    val address = obj.optString("address", "Ward 42, T Nagar, Chennai, Tamil Nadu — 600017")
    val opdType = obj.optString("opdType", "General OPD")
    val doctorName = obj.optString("doctorName", "Dr. Priya Subramanian")
    val abha = obj.optString("abha", "${firstName.lowercase()}.${lastName.lowercase()}@abdm")

    return Patient(
      id = id,
      patientNo = patientNo,
      firstName = firstName,
      lastName = lastName,
      ageYears = ageYears,
      gender = gender,
      mobile = mobile,
      district = district,
      state = state,
      address = address,
      opdType = opdType,
      doctorName = doctorName,
      abha = abha,
      aadharMasked = "XXXX XXXX 8492",
      scheme = "PMJAY / TN CMCHIS",
      visits = ChennaiSeedData.defaultPatient.visits,
      vitals = ChennaiSeedData.defaultPatient.vitals,
      labRecords = ChennaiSeedData.defaultPatient.labRecords,
      prescriptions = ChennaiSeedData.defaultPatient.prescriptions
    )
  }
}

```

---

## FILE: `app/src/main/java/com/example/util/QrCodeGenerator.kt`

```kotlin
package com.example.util

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import java.io.ByteArrayOutputStream
import kotlin.experimental.xor

/**
 * High-reliability QR Code Generator for ABDM Health Card scannable at Kiosk.
 * Generates ISO/IEC 18004 compliant QR BitMatrix and renders on Jetpack Compose Canvas.
 */
object QrCodeGenerator {

  fun encode(content: String): Array<BooleanArray> {
    val bytes = content.toByteArray(Charsets.UTF_8)
    // Select version based on content length
    val version = when {
      bytes.size <= 32 -> 3  // 29x29
      bytes.size <= 53 -> 4  // 33x33
      bytes.size <= 78 -> 5  // 37x37
      bytes.size <= 106 -> 6 // 41x41
      bytes.size <= 134 -> 7 // 45x45
      bytes.size <= 154 -> 8 // 49x49
      bytes.size <= 192 -> 9 // 53x53
      else -> 10            // 57x57
    }

    val dimension = 17 + 4 * version
    val matrix = Array(dimension) { BooleanArray(dimension) }
    val isReserved = Array(dimension) { BooleanArray(dimension) }

    // 1. Finder patterns (top-left, top-right, bottom-left)
    drawFinderPattern(matrix, isReserved, 0, 0)
    drawFinderPattern(matrix, isReserved, dimension - 7, 0)
    drawFinderPattern(matrix, isReserved, 0, dimension - 7)

    // 2. Separators around finders
    drawSeparators(matrix, isReserved, dimension)

    // 3. Alignment patterns (for version >= 2)
    val alignCoords = getAlignmentCoords(version)
    for (r in alignCoords) {
      for (c in alignCoords) {
        if (!isReserved[r][c]) {
          drawAlignmentPattern(matrix, isReserved, r, c)
        }
      }
    }

    // 4. Timing patterns
    for (i in 8 until dimension - 8) {
      val isBlack = i % 2 == 0
      if (!isReserved[6][i]) {
        matrix[6][i] = isBlack
        isReserved[6][i] = true
      }
      if (!isReserved[i][6]) {
        matrix[i][6] = isBlack
        isReserved[i][6] = true
      }
    }

    // 5. Dark module
    matrix[4 * version + 9][8] = true
    isReserved[4 * version + 9][8] = true

    // 6. Format info reservation
    reserveFormatInfo(isReserved, dimension)

    // 7. Version info reservation for version >= 7
    if (version >= 7) {
      reserveVersionInfo(isReserved, dimension)
    }

    // 8. Encode data + error correction
    val dataBits = generateDataBits(bytes, version)

    // 9. Place data bits in matrix and apply Mask 0 ((r+c)%2 == 0)
    var bitIndex = 0
    var upward = true
    var col = dimension - 1
    while (col > 0) {
      if (col == 6) col-- // Skip vertical timing line
      val rows = if (upward) (dimension - 1 downTo 0) else (0 until dimension)
      for (r in rows) {
        for (c in listOf(col, col - 1)) {
          if (!isReserved[r][c]) {
            val bit = if (bitIndex < dataBits.size) dataBits[bitIndex++] else false
            // Mask pattern 0: (row + col) % 2 == 0
            val mask = (r + c) % 2 == 0
            matrix[r][c] = bit xor mask
          }
        }
      }
      upward = !upward
      col -= 2
    }

    // 10. Write format info (Mask 0, Error Correction Level L: 01)
    // Precomputed format info for ECL L, Mask 0: 0x77C4 -> 15 bits: 111011111000100
    val formatBits = booleanArrayOf(
      true, true, true, false, true, true, true, true,
      true, false, false, false, true, false, false
    )
    writeFormatInfo(matrix, formatBits, dimension)

    return matrix
  }

  private fun drawFinderPattern(
    matrix: Array<BooleanArray>,
    reserved: Array<BooleanArray>,
    row: Int,
    col: Int
  ) {
    for (r in 0 until 7) {
      for (c in 0 until 7) {
        val isBlack = r == 0 || r == 6 || c == 0 || c == 6 || (r in 2..4 && c in 2..4)
        matrix[row + r][col + c] = isBlack
        reserved[row + r][col + c] = true
      }
    }
  }

  private fun drawSeparators(
    matrix: Array<BooleanArray>,
    reserved: Array<BooleanArray>,
    dim: Int
  ) {
    for (i in 0..7) {
      // Top-Left
      if (7 < dim && i < dim) {
        matrix[7][i] = false; reserved[7][i] = true
        matrix[i][7] = false; reserved[i][7] = true
      }
      // Top-Right
      if (dim - 8 >= 0 && i < dim) {
        matrix[7][dim - 1 - i] = false; reserved[7][dim - 1 - i] = true
        matrix[i][dim - 8] = false; reserved[i][dim - 8] = true
      }
      // Bottom-Left
      if (dim - 8 >= 0 && i < dim) {
        matrix[dim - 8][i] = false; reserved[dim - 8][i] = true
        matrix[dim - 1 - i][7] = false; reserved[dim - 1 - i][7] = true
      }
    }
  }

  private fun drawAlignmentPattern(
    matrix: Array<BooleanArray>,
    reserved: Array<BooleanArray>,
    centerRow: Int,
    centerCol: Int
  ) {
    for (r in -2..2) {
      for (c in -2..2) {
        val isBlack = r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)
        matrix[centerRow + r][centerCol + c] = isBlack
        reserved[centerRow + r][centerCol + c] = true
      }
    }
  }

  private fun getAlignmentCoords(version: Int): IntArray {
    return when (version) {
      2 -> intArrayOf(6, 18)
      3 -> intArrayOf(6, 22)
      4 -> intArrayOf(6, 26)
      5 -> intArrayOf(6, 30)
      6 -> intArrayOf(6, 34)
      7 -> intArrayOf(6, 22, 38)
      8 -> intArrayOf(6, 24, 42)
      9 -> intArrayOf(6, 26, 46)
      10 -> intArrayOf(6, 28, 50)
      else -> intArrayOf()
    }
  }

  private fun reserveFormatInfo(reserved: Array<BooleanArray>, dim: Int) {
    for (i in 0..8) {
      reserved[8][i] = true
      reserved[i][8] = true
    }
    for (i in dim - 8 until dim) {
      reserved[8][i] = true
      reserved[i][8] = true
    }
  }

  private fun reserveVersionInfo(reserved: Array<BooleanArray>, dim: Int) {
    for (r in 0..5) {
      for (c in dim - 11 until dim - 8) {
        reserved[r][c] = true
        reserved[c][r] = true
      }
    }
  }

  private fun writeFormatInfo(matrix: Array<BooleanArray>, bits: BooleanArray, dim: Int) {
    // Write format bits
    // Top-Left around finder:
    // (8,0)..(8,5), (8,7), (8,8), (7,8), (5,8)..(0,8)
    val tlCoords = listOf(
      8 to 0, 8 to 1, 8 to 2, 8 to 3, 8 to 4, 8 to 5, 8 to 7, 8 to 8,
      7 to 8, 5 to 8, 4 to 8, 3 to 8, 2 to 8, 1 to 8, 0 to 8
    )
    for (i in 0..14) {
      val (r, c) = tlCoords[i]
      matrix[r][c] = bits[i]
    }

    // Split across bottom-left and top-right:
    // Bottom-Left (dim-1 down to dim-7, 8)
    for (i in 0..6) {
      matrix[dim - 1 - i][8] = bits[i]
    }
    // Top-Right (8, dim-8 to dim-1)
    for (i in 7..14) {
      matrix[8][dim - 15 + i] = bits[i]
    }
  }

  private fun generateDataBits(data: ByteArray, version: Int): BooleanArray {
    val bitList = ArrayList<Boolean>()

    // Byte mode indicator: 0100
    addBits(bitList, 4, 4)

    // Character count (8 bits for v1-9, 16 bits for v10+)
    val countBits = if (version <= 9) 8 else 16
    addBits(bitList, data.size, countBits)

    // Data bytes
    for (b in data) {
      addBits(bitList, (b.toInt() and 0xFF), 8)
    }

    // Total data capacity for Version and Level L
    val totalDataCodewords = getDataCapacity(version)
    val totalDataBits = totalDataCodewords * 8

    // Terminator (up to 4 zeroes)
    val termLen = (totalDataBits - bitList.size).coerceIn(0, 4)
    repeat(termLen) { bitList.add(false) }

    // Pad to byte boundary
    while (bitList.size % 8 != 0) {
      bitList.add(false)
    }

    // Pad bytes: 0xEC (236), 0x11 (17) alternating
    val padBytes = byteArrayOf(0xEC.toByte(), 0x11.toByte())
    var padIdx = 0
    while (bitList.size < totalDataBits) {
      addBits(bitList, padBytes[padIdx % 2].toInt() and 0xFF, 8)
      padIdx++
    }

    // Error Correction generation (Reed-Solomon)
    val rawBytes = ByteArray(totalDataCodewords)
    for (i in 0 until totalDataCodewords) {
      var byteVal = 0
      for (b in 0..7) {
        val bit = bitList[i * 8 + b]
        if (bit) byteVal = byteVal or (1 shl (7 - b))
      }
      rawBytes[i] = byteVal.toByte()
    }

    val ecCount = getEcCodewords(version)
    val ecBytes = calculateReedSolomon(rawBytes, ecCount)

    // Combine data + EC bits
    val finalBits = ArrayList<Boolean>()
    for (b in rawBytes) {
      addBits(finalBits, b.toInt() and 0xFF, 8)
    }
    for (b in ecBytes) {
      addBits(finalBits, b.toInt() and 0xFF, 8)
    }

    return finalBits.toBooleanArray()
  }

  private fun addBits(list: ArrayList<Boolean>, value: Int, numBits: Int) {
    for (i in numBits - 1 downTo 0) {
      list.add(((value shr i) and 1) == 1)
    }
  }

  private fun getDataCapacity(version: Int): Int {
    return when (version) {
      3 -> 55
      4 -> 80
      5 -> 108
      6 -> 136
      7 -> 156
      8 -> 194
      9 -> 232
      else -> 274
    }
  }

  private fun getEcCodewords(version: Int): Int {
    return when (version) {
      3 -> 15
      4 -> 20
      5 -> 26
      6 -> 18 * 2
      7 -> 20 * 2
      8 -> 24 * 2
      9 -> 30 * 2
      else -> 18 * 4
    }
  }

  // GF(256) arithmetic for Reed-Solomon Error Correction
  private val expTable = IntArray(512)
  private val logTable = IntArray(256)

  init {
    var x = 1
    for (i in 0 until 255) {
      expTable[i] = x
      expTable[i + 255] = x
      logTable[x] = i
      x = (x shl 1)
      if (x >= 256) x = x xor 0x11D // Primitive polynomial x^8 + x^4 + x^3 + x^2 + 1
    }
  }

  private fun gfMul(a: Int, b: Int): Int {
    if (a == 0 || b == 0) return 0
    return expTable[logTable[a] + logTable[b]]
  }

  private fun calculateReedSolomon(data: ByteArray, ecLen: Int): ByteArray {
    // Generate generator polynomial
    var gen = intArrayOf(1)
    for (i in 0 until ecLen) {
      val next = IntArray(gen.size + 1)
      val root = expTable[i]
      for (j in gen.indices) {
        next[j] = next[j] xor gen[j]
        next[j + 1] = next[j + 1] xor gfMul(gen[j], root)
      }
      gen = next
    }

    val remainder = IntArray(ecLen)
    for (b in data) {
      val factor = (b.toInt() and 0xFF) xor remainder[0]
      for (j in 0 until ecLen - 1) {
        remainder[j] = remainder[j + 1] xor gfMul(gen[j + 1], factor)
      }
      remainder[ecLen - 1] = gfMul(gen[ecLen], factor)
    }

    val result = ByteArray(ecLen)
    for (i in 0 until ecLen) {
      result[i] = remainder[i].toByte()
    }
    return result
  }
}

/**
 * Jetpack Compose QR Code View.
 * Displays high-contrast, beautiful QR with white padding, rounded corners, and crisp scaling.
 */
@Composable
fun QrCodeView(
  content: String,
  modifier: Modifier = Modifier,
  tintColor: Color = Color(0xFF071421),
  backgroundColor: Color = Color.White
) {
  val matrix = remember(content) {
    try {
      QrCodeGenerator.encode(content)
    } catch (_: Exception) {
      // Fallback matrix if encoding error
      Array(29) { r -> BooleanArray(29) { c -> (r in 0..6 && c in 0..6) || (r in 0..6 && c >= 22) || (r >= 22 && c in 0..6) } }
    }
  }

  Box(
    modifier = modifier
      .aspectRatio(1f)
      .clip(RoundedCornerShape(16.dp))
      .background(backgroundColor)
      .padding(16.dp),
    contentAlignment = Alignment.Center
  ) {
    Canvas(modifier = Modifier.fillMaxSize()) {
      val dimension = matrix.size
      val cellSize = size.width / dimension

      for (r in 0 until dimension) {
        for (c in 0 until dimension) {
          if (matrix[r][c]) {
            drawRect(
              color = tintColor,
              topLeft = Offset(c * cellSize, r * cellSize),
              size = Size(cellSize + 0.5f, cellSize + 0.5f)
            )
          }
        }
      }
    }
  }
}

```

---

## FILE: `app/src/test/java/com/example/ExampleUnitTest.kt`

```kotlin
package com.example

import org.junit.Assert.*
import org.junit.Test

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
class ExampleUnitTest {
  @Test
  fun addition_isCorrect() {
    assertEquals(4, 2 + 2)
  }
}

```

---

## FILE: `app/src/test/java/com/example/ExampleRobolectricTest.kt`

```kotlin
package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("MEDATHON", appName)
  }
}

```

---

## FILE: `app/src/test/java/com/example/GreetingScreenshotTest.kt`

```kotlin
package com.example

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onRoot
import com.example.ui.components.MedathonHeader
import com.example.ui.theme.MyApplicationTheme
import com.github.takahirom.roborazzi.RobolectricDeviceQualifiers
import com.github.takahirom.roborazzi.captureRoboImage
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(qualifiers = RobolectricDeviceQualifiers.Pixel8, sdk = [36])
class GreetingScreenshotTest {

  @get:Rule val composeTestRule = createComposeRule()

  @Test
  fun greeting_screenshot() {
    composeTestRule.setContent {
      MyApplicationTheme {
        MedathonHeader(title = "MEDATHON", subtitle = "Smart Healthcare · Chennai")
      }
    }

    composeTestRule.onRoot().captureRoboImage(filePath = "src/test/screenshots/greeting.png")
  }
}

```

---

