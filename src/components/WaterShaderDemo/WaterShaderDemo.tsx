import { useRef, useState, useEffect } from 'react'
import { useThreeScene } from './useThreeScene'
import { uiTimings, flightInfoDelayMs } from './config'

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
  description?: string
  flightInfo?: FlightInfo
}

// ============================================
// HELPER
// ============================================

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// ============================================
// COMPONENT
// ============================================

export function WaterShaderDemo({
  description = "Work shouldn't feel like a chore. It can be a flying experience. We makes it easier to stay in flow with ambient radio and lofi. Insert your ticket, start the mix, and let your focus take off.",
  flightInfo = {
    location: 'BERKELEY',
    destination: 'LOS ANGELES',
    passenger: 'CLAUDIUS MA',
    seat: 'K10',
    totalDuration: '04HR 13MIN',
  },
}: WaterShaderDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { showShadow, hideShadow } = useThreeScene(containerRef)
  
  // Track button states for opacity
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStopped, setIsStopped] = useState(true)
  
  // Ticket state - will be controlled by Arduino signal in the future
  // For now, can be toggled for testing
  const [hasTicket, setHasTicket] = useState(false)
  const [showFlightInfo, setShowFlightInfo] = useState(false)
  
  // Title fade animation state
  const [titleOpacity, setTitleOpacity] = useState(1)
  const [displayedText, setDisplayedText] = useState('FLY')
  const isFirstRender = useRef(true)
  
  // Timer state - load from localStorage on init
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const saved = localStorage.getItem('workonflight-timer')
    return saved ? parseInt(saved, 10) : 0
  })

  // Handle ticket insertion/removal - controls shadow and flight info visibility
  useEffect(() => {
    let timeoutId: number | undefined

    if (hasTicket) {
      showShadow()
      // Show flight info after fly-in animation + configured delay
      timeoutId = window.setTimeout(() => {
        setShowFlightInfo(true)
      }, flightInfoDelayMs)
    } else {
      hideShadow()
      setShowFlightInfo(false) // Hide immediately
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [hasTicket, showShadow, hideShadow])

  // Timer effect - saves to localStorage every second
  useEffect(() => {
    let intervalId: number | undefined

    if (isPlaying) {
      intervalId = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const newValue = prev + 1
          localStorage.setItem('workonflight-timer', String(newValue))
          return newValue
        })
      }, 1000)
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [isPlaying])

  const handlePlay = () => {
    setIsPlaying(true)
    setIsStopped(false)
  }

  const handleStop = () => {
    setIsStopped(true)
    setIsPlaying(false)
    // Timer persists - no reset
  }

  // Temp: Toggle ticket for testing (remove when Arduino is connected)
  const toggleTicket = () => setHasTicket(prev => !prev)

  // Display "FLY" or timer based on playing state
  const targetText = isPlaying ? formatTime(elapsedSeconds) : 'FLY'
  
  // Title fade animation effect - fade out, change text, fade in
  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false
      setDisplayedText(targetText)
      return
    }
    
    // Only animate when switching between FLY and timer (not every second)
    const isTextTypeChange = (displayedText === 'FLY') !== (targetText === 'FLY')
    
    if (isTextTypeChange) {
      // Fade out
      setTitleOpacity(0)
      
      // After fade out, change text and fade in
      const timeout = setTimeout(() => {
        setDisplayedText(targetText)
        setTitleOpacity(1)
      }, uiTimings.fadeOut * 1000)
      
      return () => clearTimeout(timeout)
    } else {
      // Just update the text (timer counting)
      setDisplayedText(targetText)
    }
  }, [targetText, displayedText])

  const infoItems = [
    { label: 'LOCATION:', value: flightInfo.location },
    { label: 'DESTINATION:', value: flightInfo.destination },
    { label: 'PASSENGER:', value: flightInfo.passenger },
    { label: 'SEAT:', value: flightInfo.seat },
    { label: 'TOTAL DURATION:', value: flightInfo.totalDuration },
  ]

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.canvas} />
      
      {/* Dark overlay for background dimming */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: isPlaying ? 1 : 0,
          transition: `opacity ${uiTimings.fadeIn}s ease`
        }}
      />

      <div className={styles.grid}>
        <h1 
          className={styles.time} 
          style={{ 
            color: colors.secondary, 
            fontFamily: fonts.heavy, 
            cursor: 'pointer', 
            pointerEvents: 'auto',
            opacity: titleOpacity,
            transition: `opacity ${uiTimings.fadeIn}s ease-in, opacity ${uiTimings.fadeOut}s ease-out`
          }}
          onClick={toggleTicket}
        >
          {displayedText}
        </h1>
        <p 
          className={styles.description} 
          style={{ 
            color: colors.primary, 
            fontFamily: fonts.light,
            opacity: isPlaying ? uiTimings.dimmedOpacity : 1,
            transition: `opacity ${uiTimings.fadeOut}s ease`
          }}
        >
          {description}
        </p>

        <div 
          className={styles.flightInfoContainer}
          style={{ 
            opacity: showFlightInfo ? (isPlaying ? uiTimings.dimmedOpacity : 1) : 0, 
            transition: `opacity ${uiTimings.fadeOut}s ease`,
            pointerEvents: showFlightInfo ? 'auto' : 'none'
          }}
        >
          {infoItems.map((item) => (
            <div key={item.label} className={styles.infoItem}>
              <span className={styles.label} style={{ color: colors.primary, fontFamily: fonts.bold }}>{item.label}</span>
              <span className={styles.value} style={{ color: colors.primary, fontFamily: fonts.light }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Thought Bubble Group - Fixed position, col-7 span-5 */}
        <div className="absolute top-[15%] left-0 right-0 grid grid-cols-12 pointer-events-none z-50">
          <div className="col-start-7 col-span-5 pointer-events-auto">
            {/* All bubbles group */}
            <div className="relative">
              {/* Main thought bubble */}
              <img 
                src="/water-demo/mainBubble.svg" 
                alt="" 
                className="w-[35vw]" 
                style={{ opacity: isPlaying ? 0.2 : 1, transition: 'opacity 0.3s ease' }}
              />
              
              {/* Play and Stop buttons group - centered on main bubble (stays visible) */}
              <div className="absolute inset-0 flex items-center justify-center gap-10 -translate-x-6">
                <div 
                  className="w-12 h-12 flex items-center justify-center cursor-pointer transition-opacity duration-200"
                  onClick={handlePlay}
                  style={{ opacity: isPlaying ? 0.2 : 1 }}
                >
                  <img src="/water-demo/playButton.svg" alt="Play" className="w-[3vw]" />
                </div>
                <div 
                  className="w-12 h-12 flex items-center justify-center cursor-pointer transition-opacity duration-200"
                  onClick={handleStop}
                  style={{ opacity: isStopped ? 0.2 : 1 }}
                >
                  <img src="/water-demo/stopButton.svg" alt="Stop" className="w-[2.5vw]" />
                </div>
              </div>
            </div>
            
            {/* Medium bubble */}
            <img 
              src="/water-demo/midBubble.svg" 
              alt="" 
              className="pl-3 w-[3vw]" 
              style={{ opacity: isPlaying ? 0.2 : 1, transition: 'opacity 0.3s ease' }}
            />
            
            {/* Small bubble */}
            <img 
              src="/water-demo/smallBubble.svg" 
              alt="" 
              className="pl-2 pt-3 w-[1.5vw]" 
              style={{ opacity: isPlaying ? 0.2 : 1, transition: 'opacity 0.3s ease' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
