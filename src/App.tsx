import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Radio, Music } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AirportSelector } from './components/AirportSelector'
import { MixedAudioPlayer } from './components/MixedAudioPlayer'
import { FlightTicket } from './components/FlightTicket'
import { Ticket } from './components/Ticket'
import { airports } from './data/airports'
import { Airport } from './types/airport'
import { useGeolocation } from './hooks/useGeolocation'
import { getDistance, calculateFlightDuration } from './lib/flightCalculator'
import { getCityName } from './lib/geocoding'
import Space from './components/Space'

function App() {
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flightDurationSeconds, setFlightDurationSeconds] = useState<
    number | null
  >(null)
  const [focusTimeSeconds, setFocusTimeSeconds] = useState(0)
  const [userCityName, setUserCityName] = useState<string | null>(null)
  const [bothAvailable, setBothAvailable] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)

  const geolocation = useGeolocation()
  const focusTimeIntervalRef = useRef<number | null>(null)
  const playPauseHandlerRef = useRef<(() => void) | null>(null)

  // Fetch city name when location is available
  useEffect(() => {
    if (
      geolocation.latitude !== null &&
      geolocation.longitude !== null &&
      !geolocation.loading &&
      !geolocation.error
    ) {
      getCityName(geolocation.latitude, geolocation.longitude).then((city) => {
        setUserCityName(city)
      })
    } else {
      setUserCityName(null)
    }
  }, [
    geolocation.latitude,
    geolocation.longitude,
    geolocation.loading,
    geolocation.error,
  ])

  // Calculate flight duration when airport is selected and location is available
  useEffect(() => {
    if (
      selectedAirport &&
      geolocation.latitude !== null &&
      geolocation.longitude !== null
    ) {
      const distance = getDistance(
        geolocation.latitude,
        geolocation.longitude,
        selectedAirport.latitude,
        selectedAirport.longitude
      )
      const duration = calculateFlightDuration(distance)
      setFlightDurationSeconds(duration)
      // Reset focus time when new airport is selected
      setFocusTimeSeconds(0)
    } else {
      setFlightDurationSeconds(null)
      setFocusTimeSeconds(0)
    }
  }, [selectedAirport, geolocation.latitude, geolocation.longitude])

  // Track focus time when playing
  useEffect(() => {
    if (isPlaying) {
      // Start timer
      focusTimeIntervalRef.current = setInterval(() => {
        setFocusTimeSeconds((prev) => {
          // Stop at flight duration maximum
          if (flightDurationSeconds !== null && prev >= flightDurationSeconds) {
            return flightDurationSeconds
          }
          return prev + 1
        })
      }, 1000) as unknown as number
    } else {
      // Pause timer
      if (focusTimeIntervalRef.current) {
        clearInterval(focusTimeIntervalRef.current)
        focusTimeIntervalRef.current = null
      }
    }

    return () => {
      if (focusTimeIntervalRef.current) {
        clearInterval(focusTimeIntervalRef.current)
      }
    }
  }, [isPlaying, flightDurationSeconds])

  const handleAirportSelect = (airport: Airport) => {
    setSelectedAirport(airport)
    setError(null)
    if (isPlaying) {
      // Pause active playback so timers and audio stay in sync with the new airport
      playPauseHandlerRef.current?.()
      setIsPlaying(false)
    }
    // Reset focus time when selecting new airport
    setFocusTimeSeconds(0)
    // Note: Auto-play disabled - user must click play button for both ATC and music
  }

  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsPlaying(false)
  }

  const handlePlayPauseClick = () => {
    playPauseHandlerRef.current?.()
  }

  const userLocation =
    geolocation.latitude !== null && geolocation.longitude !== null
      ? { latitude: geolocation.latitude, longitude: geolocation.longitude }
      : null

  return (
    <div className="min-h-screen bg-background py-40">
      {/* 12 Column Grid Layout */}
      <div className="grid w-full grid-cols-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="col-span-8 col-start-3"
        >
          <div className="flex items-center justify-center">
            <h1 className="text-5xl font-bold text-foreground">Flight Focus</h1>
          </div>
        </motion.div>

        <Space />

        {/* Error Display */}
        {(error || geolocation.error) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-8 col-start-3"
          >
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || geolocation.error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {(error || geolocation.error) && <Space />}

        {/* Airport Selection */}
        <div className="col-span-12">
          <AirportSelector
            airports={airports}
            selectedAirport={selectedAirport}
            onAirportSelect={handleAirportSelect}
          />
        </div>

        <Space />

        {/* Ticket - Top decoration */}
        <div className="col-span-12">
          <Ticket />
        </div>

        <Space />

        {/* Flight Ticket - Centered on top */}
        <div className="col-span-12">
          <FlightTicket
            airport={selectedAirport}
            userLocation={userLocation}
            userCityName={userCityName}
            flightDurationSeconds={flightDurationSeconds}
            focusTimeSeconds={focusTimeSeconds}
            isPlaying={isPlaying}
            isLoading={isLoadingAudio}
            bothAvailable={bothAvailable}
            onPlayPause={handlePlayPauseClick}
          />
        </div>

        <Space />

        {/* Mixed Audio Player */}
        <div className="col-span-12">
          <MixedAudioPlayer
            airport={selectedAirport}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onError={handleError}
            onBothAvailableChange={setBothAvailable}
            onLoadingChange={setIsLoadingAudio}
            onPlayPauseHandlerReady={(handler) => {
              playPauseHandlerRef.current = handler
            }}
          />
        </div>

        <Space />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="col-span-12 text-center text-muted-foreground"
        >
          <p className="text-sm">
            Audio feeds provided by{' '}
            <a
              href="https://liveatc.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              LiveATC.net
            </a>
          </p>
          <p className="text-xs">
            Live ATC audio streams provided via CORS proxy. Some streams may be
            temporarily unavailable.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
