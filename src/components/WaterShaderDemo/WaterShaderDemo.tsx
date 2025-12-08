import { useRef } from 'react'
import { useThreeScene } from './useThreeScene'
import styles from './WaterShaderDemo.module.css'

interface WaterShaderDemoProps {
  /** Optional custom title */
  title?: string
  /** Optional custom subtitle */
  subtitle?: string
  /** Optional custom button text */
  buttonText?: string
}

export function WaterShaderDemo({
  title = 'Water Distortion & Shadow',
  subtitle = 'Scroll or click button to trigger airplane',
  buttonText = 'Trigger Landing',
}: WaterShaderDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { triggerLanding } = useThreeScene(containerRef)

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles['canvas-container']} />

      <div className={styles['ui-overlay']}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <button
          className={styles['trigger-button']}
          onClick={triggerLanding}
          type="button"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
