/*
 * MAX4466 Microphone Amplifier + Bulb Control
 * 
 * Reads analog input from MAX4466 microphone on A0
 * Controls simple bulb on pin D1 based on sound levels
 * 
 * Connections:
 * MAX4466: VCC -> 3.3V, GND -> GND, OUT -> A0
 * Bulb: One terminal -> D1, Other terminal -> GND
 * Note: For higher current bulbs, use a transistor/relay between D1 and bulb
 */

// Pin definitions
const int MIC_PIN = A0;        // MAX4466 output connected to A0
const int BULB_PIN = 1;        // Bulb connected to D1 (digital pin 1)

// Configuration variables
const int SAMPLE_WINDOW = 500;   // Sample window width in ms (50ms = 20Hz)
int THRESHOLD_ON = 15;          // Sound threshold to turn bulb ON
int THRESHOLD_OFF = 10;         // Sound threshold to turn bulb OFF (lower = hysteresis)
const int SENSITIVITY_MULTIPLIER = 3; // How much above baseline to trigger bulb
const unsigned long MIN_STATE_TIME = 1000; // Minimum time to stay on/off (ms) - prevents flickering

// Variables
unsigned int sample;
int peakToPeak = 0;
unsigned long startMillis;
int baselineNoise = 0;  // Auto-calibrated baseline noise level
const int CALIBRATION_DURATION = 2000; // 2 seconds to calibrate

// State tracking for debouncing
bool bulbState = false;           // Current bulb state (true = ON, false = OFF)
unsigned long lastStateChange = 0; // Timestamp of last state change

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(9600);
  
  // Wait for serial port to connect (useful for some boards)
  while (!Serial) {
    delay(10);
  }
  
  // Set bulb pin as output
  pinMode(BULB_PIN, OUTPUT);
  
  // Initialize bulb state
  bulbState = false;
  digitalWrite(BULB_PIN, LOW);
  lastStateChange = millis();
  
  // Test bulb by blinking it 3 times at startup
  Serial.println("Testing bulb...");
  for (int i = 0; i < 3; i++) {
    digitalWrite(BULB_PIN, HIGH);
    delay(200);
    digitalWrite(BULB_PIN, LOW);
    delay(200);
  }
  bulbState = false;
  digitalWrite(BULB_PIN, LOW);
  lastStateChange = millis();
  
  Serial.println("\n=== MAX4466 Microphone + Bulb Control initialized ===");
  Serial.println("Calibrating baseline noise (stay quiet for 2 seconds)...");
  
  // Calibrate baseline noise level
  unsigned long calibrationStart = millis();
  long totalPeakToPeak = 0;
  int sampleCount = 0;
  
  while (millis() - calibrationStart < CALIBRATION_DURATION) {
    unsigned long sampleStart = millis();
    unsigned int signalMax = 0;
    unsigned int signalMin = 1024;
    
    while (millis() - sampleStart < SAMPLE_WINDOW) {
      sample = analogRead(MIC_PIN);
      if (sample < 1024) {
        if (sample > signalMax) signalMax = sample;
        if (sample < signalMin) signalMin = sample;
      }
    }
    
    int pp = signalMax - signalMin;
    totalPeakToPeak += pp;
    sampleCount++;
    
    Serial.print(".");
    delay(50);
  }
  
  baselineNoise = totalPeakToPeak / sampleCount;
  THRESHOLD_ON = baselineNoise * SENSITIVITY_MULTIPLIER;
  THRESHOLD_OFF = baselineNoise * (SENSITIVITY_MULTIPLIER - 1); // Lower threshold for turning off
  
  Serial.println();
  Serial.print("Baseline noise: ");
  Serial.print(baselineNoise);
  Serial.print(" | Threshold ON: ");
  Serial.print(THRESHOLD_ON);
  Serial.print(" | Threshold OFF: ");
  Serial.println(THRESHOLD_OFF);
  Serial.print("Bulb Pin: ");
  Serial.println(BULB_PIN);
  Serial.print("Microphone Pin: A");
  Serial.println(MIC_PIN - A0);
  Serial.println("----------------------------------------\n");
}

void loop() {
  unsigned long startMillis = millis();
  unsigned int signalMax = 0;
  unsigned int signalMin = 1024;
  
  // Collect samples for SAMPLE_WINDOW duration
  while (millis() - startMillis < SAMPLE_WINDOW) {
    sample = analogRead(MIC_PIN);
    if (sample < 1024) {
      if (sample > signalMax) {
        signalMax = sample;
      }
      if (sample < signalMin) {
        signalMin = sample;
      }
    }
  }
  
  // Calculate peak-to-peak amplitude
  peakToPeak = signalMax - signalMin;
  
  // Always print sensor readings for debugging
  Serial.print("Raw: ");
  Serial.print(signalMin);
  Serial.print("-");
  Serial.print(signalMax);
  Serial.print(" | Peak-to-Peak: ");
  Serial.print(peakToPeak);
  Serial.print(" | Baseline: ");
  Serial.print(baselineNoise);
  Serial.print(" | Thresh ON: ");
  Serial.print(THRESHOLD_ON);
  Serial.print(" | Thresh OFF: ");
  Serial.print(THRESHOLD_OFF);
  
  // Check if enough time has passed since last state change (debouncing)
  unsigned long currentTime = millis();
  unsigned long timeSinceChange = currentTime - lastStateChange;
  bool enoughTimePassed = timeSinceChange >= MIN_STATE_TIME;
  
  // Determine desired state based on sound level with hysteresis
  // If bulb is OFF: turn ON when sound exceeds THRESHOLD_ON
  // If bulb is ON: turn OFF when sound drops below THRESHOLD_OFF
  bool desiredState;
  if (bulbState) {
    // Currently ON - turn OFF only when below lower threshold
    desiredState = (peakToPeak >= THRESHOLD_OFF);
  } else {
    // Currently OFF - turn ON only when above higher threshold
    desiredState = (peakToPeak > THRESHOLD_ON);
  }
  
  // Only change state if enough time has passed AND state should change
  if (enoughTimePassed && desiredState != bulbState) {
    bulbState = desiredState;
    digitalWrite(BULB_PIN, bulbState ? HIGH : LOW);
    lastStateChange = currentTime;
    Serial.print(" | [STATE CHANGED]");
  }
  
  // Display current state and timing info
  Serial.print(" | Bulb: ");
  Serial.print(bulbState ? "ON" : "OFF");
  Serial.print(" | Time since change: ");
  Serial.print(timeSinceChange);
  Serial.print("ms");
  
  Serial.println(); // New line
  
  // Small delay to prevent overwhelming the serial output
  delay(100); // Increased delay so output is readable
}
