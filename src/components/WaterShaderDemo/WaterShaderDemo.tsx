import { useRef } from 'react'
import { useThreeScene } from './useThreeScene'

// ============================================
// COLORS - Edit these to change color palette
// ============================================

const colors = {
  primary: '#FFFFFF',
  secondary: '#e8a87c',
}

const fonts = {
  light: '"SF Mono Light", "SFMono-Light", ui-monospace, monospace',
  regular: '"SF Mono", "SFMono-Regular", ui-monospace, monospace',
  bold: '"SF Mono Bold", "SFMono-Bold", ui-monospace, monospace',
  heavy: '"SF Mono Heavy", "SFMono-Heavy", ui-monospace, monospace',
}

// ============================================
// STYLES - Edit these to change appearance
// ============================================

const styles = {
  // Layout
  container: 'relative w-full h-screen overflow-hidden',
  canvas: 'absolute inset-0 z-[1]',
  grid: 'absolute inset-0 grid grid-cols-12 content-start py-10 pointer-events-none z-10',

  // Time
  time: 'col-start-2 col-span-12 text-[100pt]',

  // Description
  description: 'col-span-4 col-start-2 text-sm uppercase mb-28',

  // Flight info
  flightInfoContainer: 'col-span-3 col-start-2 flex flex-col gap-6 self-start',
  infoItem: 'flex flex-col gap-1',
  label: 'text-sm uppercase',
  value: 'text-sm uppercase',
}

// ============================================
// TYPES
// ============================================

interface FlightInfo {
  location?: string
  destination?: string
  passenger?: string
  seat?: string
  totalDuration?: string
}

interface WaterShaderDemoProps {
  time?: string
  description?: string
  flightInfo?: FlightInfo
}

// ============================================
// COMPONENT
// ============================================

export function WaterShaderDemo({
  time = '05:30',
  description = 'AT ITS CORE, JAZZ GUITAR IS A STYLE OF PLAYING THAT PRIORITIZES IMPROVISATION, RHYTHMIC SWING, AND COMPLEX HARMONY. UNLIKE ROCK OR POP, WHERE YOU OFTEN PLAY',
  flightInfo = {
    location: 'BERKELEY',
    destination: 'LOS ANGELES',
    passenger: 'CLAUDIUS MA',
    seat: 'K10',
    totalDuration: '04HR 13MIN',
  },
}: WaterShaderDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { toggleAirplane } = useThreeScene(containerRef)

  const infoItems = [
    { label: 'LOCATION:', value: flightInfo.location },
    { label: 'DESTINATION:', value: flightInfo.destination },
    { label: 'PASSENGER:', value: flightInfo.passenger },
    { label: 'SEAT:', value: flightInfo.seat },
    { label: 'TOTAL DURATION:', value: flightInfo.totalDuration },
  ]

  return (
    <div className={styles.container} onClick={toggleAirplane} style={{ cursor: 'pointer' }}>
      <div ref={containerRef} className={styles.canvas} />

      <div className={styles.grid}>
        <h1 className={styles.time} style={{ color: colors.secondary, fontFamily: fonts.heavy }}>{time}</h1>
        <p className={styles.description} style={{ color: colors.primary, fontFamily: fonts.light }}>{description}</p>

        <div className={styles.flightInfoContainer}>
          {infoItems.map((item) => (
            <div key={item.label} className={styles.infoItem}>
              <span className={styles.label} style={{ color: colors.primary, fontFamily: fonts.bold }}>{item.label}</span>
              <span className={styles.value} style={{ color: colors.primary, fontFamily: fonts.light }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
