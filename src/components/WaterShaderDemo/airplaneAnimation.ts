import * as THREE from 'three'
import gsap from 'gsap'

interface AirplaneAnimationConfig {
  shadowPlane: THREE.Mesh
  targetX?: number
  targetY?: number
  duration?: number
}

/**
 * Triggers the airplane shadow animation from bottom-right to center
 */
export function triggerAirplaneAnimation({
  shadowPlane,
  targetX = 0,
  targetY = 0,
  duration = 2.5,
}: AirplaneAnimationConfig): void {
  // Animate position - slide from bottom-right to center
  gsap.to(shadowPlane.position, {
    x: targetX,
    y: targetY,
    duration,
    ease: 'power2.out',
  })

  // Animate Scale - grow as it approaches
  gsap.fromTo(
    shadowPlane.scale,
    { x: 0.5, y: 0.5 },
    { x: 1.2, y: 1.2, duration, ease: 'power2.out' }
  )
}

/**
 * Resets the airplane shadow to its initial position
 */
export function resetAirplanePosition(shadowPlane: THREE.Mesh): void {
  shadowPlane.position.set(1.5, -1.5, 0.5)
  shadowPlane.scale.set(1, 1, 1)
}
