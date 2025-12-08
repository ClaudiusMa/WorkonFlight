import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders'
import { triggerAirplaneAnimation, resetAirplanePosition } from './airplaneAnimation'

interface UseThreeSceneReturn {
  triggerLanding: () => void
  resetScene: () => void
}

export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>
): UseThreeSceneReturn {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null)
  const uniformsRef = useRef<{ uTime: { value: number }; uTexture: { value: THREE.Texture | null } } | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 2D Orthographic camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)
    cameraRef.current = camera

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Texture loader
    const loader = new THREE.TextureLoader()

    // Load textures
    const bgTexture = loader.load('/water-demo/waterBackground.png')
    const shadowTexture = loader.load('/water-demo/planeShadow.png')

    // Create water background with shader
    const shaderGeometry = new THREE.PlaneGeometry(2, 2)
    const shaderUniforms = {
      uTime: { value: 0 },
      uTexture: { value: bgTexture },
    }
    uniformsRef.current = shaderUniforms

    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: shaderUniforms,
    })

    const waterPlane = new THREE.Mesh(shaderGeometry, waterMaterial)
    scene.add(waterPlane)

    // Create airplane shadow
    const shadowAspect = 1.0
    const shadowGeometry = new THREE.PlaneGeometry(0.5, 0.5 * shadowAspect)
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    })

    const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial)
    shadowPlane.renderOrder = 1
    shadowPlane.position.set(1.5, -1.5, 0.5)
    shadowPlane.rotation.z = -Math.PI / 8
    scene.add(shadowPlane)
    shadowPlaneRef.current = shadowPlane

    // Animation loop
    const clock = new THREE.Clock()
    clockRef.current = clock

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate)

      if (uniformsRef.current && clockRef.current) {
        uniformsRef.current.uTime.value = clockRef.current.getElapsedTime()
      }

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    function handleResize() {
      if (!container || !renderer) return
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [containerRef])

  const triggerLanding = useCallback(() => {
    if (shadowPlaneRef.current) {
      triggerAirplaneAnimation({ shadowPlane: shadowPlaneRef.current })
    }
  }, [])

  const resetScene = useCallback(() => {
    if (shadowPlaneRef.current) {
      resetAirplanePosition(shadowPlaneRef.current)
    }
  }, [])

  return { triggerLanding, resetScene }
}
