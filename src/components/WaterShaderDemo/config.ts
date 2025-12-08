// ============================================
// SHARED CONFIG - Single source of truth for all settings
// ============================================

export const airplaneConfig = {
  // Size
  size: 2.3,
  aspect: 1.0,

  // Appearance
  opacity: 0.23,
  blur: 6, // pixels

  // Starting position (off-screen bottom-right)
  startPosition: { x: 1.5, y: -2.5, z: 0.5 },

  // Fly in end position (where plane stops when flying in)
  flyInTarget: { x: 0.17, y: -0.8 },

  // Timing (in seconds)
  flyInDuration: 1.5,
  dissolveDuration: 0.5,
}

// ============================================
// UI ANIMATION TIMINGS - All UI transition timings
// ============================================

export const uiTimings = {
  // Flight info appears this many seconds after fly-in finishes
  flightInfoDelayAfterFlyIn: 0.3,
  
  // UI fade transitions (in seconds)
  fadeTransition: 0.43, // Base fade out duration
  get fadeIn() { return this.fadeTransition * (2/3) }, // Fade in is 2/3 of fade out
  get fadeOut() { return this.fadeTransition }, // Fade out uses base value
  
  // Dimmed opacity when playing
  dimmedOpacity: 0.2,
  
  // Button active state opacity
  buttonActiveOpacity: 0.2,
}

// Computed: total delay before flight info shows (in milliseconds)
export const flightInfoDelayMs = (airplaneConfig.flyInDuration + uiTimings.flightInfoDelayAfterFlyIn) * 1000

export const texturePaths = {
  background: '/water-demo/waterBackground.png',
  shadow: '/water-demo/planeShadow.png',
}
