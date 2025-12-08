import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders'
import { triggerAirplaneAnimation, flyOutAirplane } from './airplaneAnimation'
import { airplaneConfig, texturePaths } from './config'

// ============================================
// TYPES
// ============================================

interface UseThreeSceneReturn {
  flyIn: () => void
  flyOut: () => void
  showShadow: () => void
  hideShadow: () => void
}

// ============================================
// HOOK
// ============================================

export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>
): UseThreeSceneReturn {
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null)
  const uniformsRef = useRef<{ uTime: { value: number }; uTexture: { value: THREE.Texture | null } } | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const isFlownInRef = useRef<boolean>(false)
  const isShadowVisibleRef = useRef<boolean>(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Shared camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

    // =====================
    // BACKGROUND RENDERER
    // =====================
    const bgScene = new THREE.Scene()
    const bgRenderer = new THREE.WebGLRenderer({ antialias: true })
    bgRenderer.setSize(container.clientWidth, container.clientHeight)
    bgRenderer.setPixelRatio(window.devicePixelRatio)
    bgRenderer.domElement.style.position = 'absolute'
    bgRenderer.domElement.style.top = '0'
    bgRenderer.domElement.style.left = '0'
    container.appendChild(bgRenderer.domElement)

    // Texture loader
    const loader = new THREE.TextureLoader()
    const bgTexture = loader.load(texturePaths.background)

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
    bgScene.add(waterPlane)

    // =====================
    // SHADOW RENDERER (with blur)
    // =====================
    const shadowScene = new THREE.Scene()
    const shadowRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    shadowRenderer.setSize(container.clientWidth, container.clientHeight)
    shadowRenderer.setPixelRatio(window.devicePixelRatio)
    shadowRenderer.domElement.style.position = 'absolute'
    shadowRenderer.domElement.style.top = '0'
    shadowRenderer.domElement.style.left = '0'
    shadowRenderer.domElement.style.pointerEvents = 'none'
    shadowRenderer.domElement.style.filter = `blur(${airplaneConfig.blur}px)`
    container.appendChild(shadowRenderer.domElement)

    // Create airplane shadow - starts invisible (opacity 0)
    const shadowTexture = loader.load(texturePaths.shadow)
    const { size, aspect, startPosition } = airplaneConfig
    const shadowGeometry = new THREE.PlaneGeometry(size, size * aspect)
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0, // Start invisible - ticket not inserted
      side: THREE.DoubleSide,
    })

    const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial)
    shadowPlane.position.set(startPosition.x, startPosition.y, startPosition.z)
    shadowScene.add(shadowPlane)
    shadowPlaneRef.current = shadowPlane

    // Animation loop
    const clock = new THREE.Clock()
    clockRef.current = clock

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate)

      if (uniformsRef.current && clockRef.current) {
        uniformsRef.current.uTime.value = clockRef.current.getElapsedTime()
      }

      bgRenderer.render(bgScene, camera)
      shadowRenderer.render(shadowScene, camera)
    }
    animate()

    // Handle resize
    function handleResize() {
      if (!container) return
      bgRenderer.setSize(container.clientWidth, container.clientHeight)
      shadowRenderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      bgRenderer.dispose()
      shadowRenderer.dispose()
      container.removeChild(bgRenderer.domElement)
      container.removeChild(shadowRenderer.domElement)
    }
  }, [containerRef])

  const flyIn = useCallback(() => {
    if (shadowPlaneRef.current && isShadowVisibleRef.current) {
      triggerAirplaneAnimation({ shadowPlane: shadowPlaneRef.current })
      isFlownInRef.current = true
    }
  }, [])

  const flyOut = useCallback(() => {
    if (shadowPlaneRef.current && isShadowVisibleRef.current) {
      flyOutAirplane({ shadowPlane: shadowPlaneRef.current })
      isFlownInRef.current = false
    }
  }, [])

  // Show shadow when ticket is inserted (dissolve in)
  const showShadow = useCallback(() => {
    if (shadowPlaneRef.current) {
      triggerAirplaneAnimation({ shadowPlane: shadowPlaneRef.current })
      isShadowVisibleRef.current = true
      isFlownInRef.current = true
    }
  }, [])

  // Hide shadow when ticket is removed (dissolve out)
  const hideShadow = useCallback(() => {
    if (shadowPlaneRef.current) {
      flyOutAirplane({ shadowPlane: shadowPlaneRef.current })
      isShadowVisibleRef.current = false
      isFlownInRef.current = false
    }
  }, [])

  return { flyIn, flyOut, showShadow, hideShadow }
}
