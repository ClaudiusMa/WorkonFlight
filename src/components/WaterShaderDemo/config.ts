// ============================================
// SHARED CONFIG - Single source of truth for airplane settings
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

  // Timing
  flyInDuration: 1.5,
  dissolveDuration: 0.5,
}

export const texturePaths = {
  background: '/water-demo/waterBackground.png',
  shadow: '/water-demo/planeShadow.png',
}
