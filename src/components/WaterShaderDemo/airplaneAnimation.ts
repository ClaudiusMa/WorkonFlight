import * as THREE from 'three'
import gsap from 'gsap'
import { airplaneConfig } from './config'

// ============================================
// TYPES
// ============================================

interface AirplaneAnimationConfig {
  shadowPlane: THREE.Mesh
  targetX?: number
  targetY?: number
  duration?: number
}

// ============================================
// ANIMATIONS
// ============================================

/**
 * Triggers the airplane shadow animation - fly in (position only, no scale)
 */
export function triggerAirplaneAnimation({
  shadowPlane,
  targetX = airplaneConfig.flyInTarget.x,
  targetY = airplaneConfig.flyInTarget.y,
  duration = airplaneConfig.flyInDuration,
}: AirplaneAnimationConfig): void {
  const material = shadowPlane.material as THREE.MeshBasicMaterial

  // Kill any ongoing animations
  gsap.killTweensOf(shadowPlane.position)
  gsap.killTweensOf(material)

  // Reset opacity first
  material.opacity = airplaneConfig.opacity

  gsap.to(shadowPlane.position, {
    x: targetX,
    y: targetY,
    duration,
    ease: 'power2.out',
  })
}

/**
 * Dissolves airplane and resets to start position
 */
export function flyOutAirplane({
  shadowPlane,
  duration = airplaneConfig.dissolveDuration,
}: { shadowPlane: THREE.Mesh; duration?: number }): void {
  const material = shadowPlane.material as THREE.MeshBasicMaterial

  // Fade out
  gsap.to(material, {
    opacity: 0,
    duration,
    ease: 'easeOut',
    onComplete: () => {
      // Reset position after fade out
      const { x, y, z } = airplaneConfig.startPosition
      shadowPlane.position.set(x, y, z)
    },
  })
}

/**
 * Resets the airplane shadow to its initial position
 */
export function resetAirplanePosition(shadowPlane: THREE.Mesh): void {
  const { x, y, z } = airplaneConfig.startPosition
  shadowPlane.position.set(x, y, z)
  shadowPlane.scale.set(1, 1, 1)
  const material = shadowPlane.material as THREE.MeshBasicMaterial
  material.opacity = airplaneConfig.opacity
}
