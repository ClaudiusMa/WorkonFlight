#include <Arduino.h>
#include <driver/i2s_pdm.h>
#include <Adafruit_NeoPixel.h>
#include <arduinoFFT.h> 

// --- PINS ---
#define PDM_CLK_PIN 32
#define PDM_DAT_PIN 27
#define LED_PIN     33    // NeoPixel Data Pin
#define POWER_PIN   2     // Instructor's Power Fix
#define NUM_LEDS    32    // 4 sticks x 8 LEDs each

// --- CONFIG ---
#define SAMPLE_RATE 16000
#define SAMPLES     512 

// --- SENSITIVITY ---
// Higher = less sensitive (harder to hit max)
#define BASS_DIV    4000   // Bass guitar, kick drum (~60-150Hz)
#define MID1_DIV    5000   // Drums, snare (~150-500Hz)
#define MID2_DIV    6000   // Guitar, piano (~500-2kHz)
#define HIGH_DIV    3000   // Vocals, cymbals (~2kHz+)

// --- SMOOTHING ---
#define ATTACK  0.15   // How fast LEDs rise (0-1, higher = faster)
#define DECAY   0.05  // How fast LEDs fall (0-1, higher = faster)

i2s_chan_handle_t rx_handle = NULL;
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

// FFT Objects
double vReal[SAMPLES];
double vImag[SAMPLES];
ArduinoFFT<double> FFT = ArduinoFFT<double>(vReal, vImag, SAMPLES, SAMPLE_RATE);

// Smoothed LED levels (persist between loops)
float smoothBass = 0, smoothMid1 = 0, smoothMid2 = 0, smoothHighs = 0;

void setup() {
  Serial.begin(115200);
  delay(500);
  
  // 1. POWER RAIL FIX (Crucial)
  pinMode(POWER_PIN, OUTPUT);
  digitalWrite(POWER_PIN, HIGH);
  delay(50); // Give it time to stabilize
  
  // 2. LED TEST (Does the stick work?)
  strip.begin();
  strip.setBrightness(50);
  
  Serial.println("--- LED TEST: RED ---");
  for(int i=0; i<NUM_LEDS; i++) strip.setPixelColor(i, 150, 0, 0);
  strip.show();
  delay(500);
  
  strip.clear();
  strip.show();

  // 3. MIC SETUP (V3 Driver)
  Serial.println("--- STARTING MIC ---");
  i2s_chan_config_t chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_AUTO, I2S_ROLE_MASTER);
  i2s_new_channel(&chan_cfg, NULL, &rx_handle);

  i2s_pdm_rx_config_t pdm_rx_cfg = {
      .clk_cfg = I2S_PDM_RX_CLK_DEFAULT_CONFIG(SAMPLE_RATE),
      .slot_cfg = I2S_PDM_RX_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO),
      .gpio_cfg = {
          .clk = (gpio_num_t)PDM_CLK_PIN,
          .din = (gpio_num_t)PDM_DAT_PIN,
      },
  };

  i2s_channel_init_pdm_rx_mode(rx_handle, &pdm_rx_cfg);
  i2s_channel_enable(rx_handle);
}

void loop() {
  int16_t r_buf[SAMPLES]; 
  size_t r_bytes = 0;

  if (i2s_channel_read(rx_handle, r_buf, sizeof(r_buf), &r_bytes, 100) == ESP_OK) {
    
    // DC Offset Removal
    long average = 0;
    for (int i = 0; i < SAMPLES; i++) average += r_buf[i];
    average /= SAMPLES;

    for (int i = 0; i < SAMPLES; i++) {
      vReal[i] = (double)(r_buf[i] - average); 
      vImag[i] = 0;
    }

    // FFT
    FFT.windowing(FFTWindow::Hamming, FFTDirection::Forward);
    FFT.compute(FFTDirection::Forward);
    FFT.complexToMagnitude();

    // Calculate Energy (4 bands based on 16kHz sample rate, 31.25Hz per bin)
    double bass = 0, mid1 = 0, mid2 = 0, highs = 0;
    for (int i = 2; i < 5; i++) bass += vReal[i];    // ~60-150Hz: Bass guitar, kick drum
    for (int i = 5; i < 16; i++) mid1 += vReal[i];   // ~150-500Hz: Drums, snare
    for (int i = 16; i < 64; i++) mid2 += vReal[i];  // ~500-2kHz: Guitar, piano
    for (int i = 64; i < 128; i++) highs += vReal[i]; // ~2kHz+: Vocals, cymbals
    highs = highs * 2.5;  // Boost highs for visibility 

    // PRINT TO PLOTTER - 4 bands for music analysis
    Serial.print("Bass:");
    Serial.print(bass);
    Serial.print(" ");
    Serial.print("Drums:");
    Serial.print(mid1);
    Serial.print(" ");
    Serial.print("Guitar:");
    Serial.print(mid2);
    Serial.print(" ");
    Serial.print("Vocals:");
    Serial.print(highs);
    Serial.print(" ");
    Serial.println("Scale:20000"); // Static line to keep graph scale steady

    // Map to LED count (0-8 LEDs lit based on sound level)
    float targetBass = constrain((float)(bass / BASS_DIV), 0, 8);
    float targetMid1 = constrain((float)(mid1 / MID1_DIV), 0, 8);
    float targetMid2 = constrain((float)(mid2 / MID2_DIV), 0, 8);
    float targetHighs = constrain((float)(highs / HIGH_DIV), 0, 8);

    // Apply attack/decay smoothing for natural feel
    if (targetBass > smoothBass) smoothBass += (targetBass - smoothBass) * ATTACK;
    else smoothBass += (targetBass - smoothBass) * DECAY;
    
    if (targetMid1 > smoothMid1) smoothMid1 += (targetMid1 - smoothMid1) * ATTACK;
    else smoothMid1 += (targetMid1 - smoothMid1) * DECAY;
    
    if (targetMid2 > smoothMid2) smoothMid2 += (targetMid2 - smoothMid2) * ATTACK;
    else smoothMid2 += (targetMid2 - smoothMid2) * DECAY;
    
    if (targetHighs > smoothHighs) smoothHighs += (targetHighs - smoothHighs) * ATTACK;
    else smoothHighs += (targetHighs - smoothHighs) * DECAY;

    int nBass = (int)smoothBass;
    int nMid1 = (int)smoothMid1;
    int nMid2 = (int)smoothMid2;
    int nHighs = (int)smoothHighs;

    // Clear all LEDs first
    strip.clear();

    // Display (VU meter style - number of LEDs = sound level)
    // Stick 1 (LEDs 0-7): Bass
    for(int i = 0; i < nBass; i++) {
      strip.setPixelColor(i, strip.Color(150, 0, 0));
    }
    // Stick 2 (LEDs 8-15): Drums
    for(int i = 8; i < 8 + nMid1; i++) {
      strip.setPixelColor(i, strip.Color(150, 0, 0));
    }
    // Stick 3 (LEDs 16-23): Guitar
    for(int i = 16; i < 16 + nMid2; i++) {
      strip.setPixelColor(i, strip.Color(150, 0, 0));
    }
    // Stick 4 (LEDs 24-31): Vocals
    for(int i = 24; i < 24 + nHighs; i++) {
      strip.setPixelColor(i, strip.Color(150, 0, 0));
    }

    strip.show();
  }
}