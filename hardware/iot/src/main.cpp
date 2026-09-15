/**
 * MEDATHON Smart Vitals Kiosk — ESP32 firmware scaffold
 * Sensors: MAX30102 (BPM/SpO2), MLX90614 (temperature)
 * Streams JSON to FastAPI WebSocket: /ws/vitals
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>

// TODO: copy from config.h (create from config.example.h)
#define WIFI_SSID "YOUR_SSID"
#define WIFI_PASSWORD "YOUR_PASSWORD"
#define WS_HOST "192.168.1.100"
#define WS_PORT 8000
#define WS_PATH "/ws/vitals"
#define KIOSK_ID "KIOSK-01"

WebSocketsClient webSocket;

void sendVitals(float bpm, float spo2, float temp, const char* patientId, const char* visitId) {
  char payload[256];
  snprintf(payload, sizeof(payload),
    "{\"kiosk_id\":\"%s\",\"patient_id\":\"%s\",\"visit_id\":\"%s\","
    "\"bpm\":%.1f,\"spo2\":%.1f,\"temperature\":%.2f}",
    KIOSK_ID, patientId, visitId, bpm, spo2, temp);
  webSocket.sendTXT(payload);
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  webSocket.begin(WS_HOST, WS_PORT, WS_PATH);
  webSocket.onEvent([](WStype_t type, uint8_t* payload, size_t length) {
    if (type == WStype_TEXT) {
      Serial.printf("WS: %s\n", payload);
    }
  });
}

void loop() {
  webSocket.loop();

  // TODO: read MAX30102 + MLX90614 via I2C
  // TODO: get patient_id / visit_id from QR scanner or keypad
  // Placeholder demo values every 5s:
  static unsigned long last = 0;
  if (millis() - last > 5000) {
    last = millis();
    sendVitals(72.0, 98.5, 36.8, "demo-patient", "demo-visit");
  }
}
