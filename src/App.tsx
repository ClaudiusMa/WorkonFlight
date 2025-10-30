import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Radio, Music } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AirportSelector } from './components/AirportSelector'
import { MixedAudioPlayer } from './components/MixedAudioPlayer'
import { FlightTicket } from './components/FlightTicket'
import { airports } from './data/airports'
import { Airport } from './types/airport'
import { useGeolocation } from './hooks/useGeolocation'
import { getDistance, calculateFlightDuration } from './lib/flightCalculator'
import { getCityName } from './lib/geocoding'

function App() {
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flightDurationSeconds, setFlightDurationSeconds] = useState<
    number | null
  >(null)
  const [focusTimeSeconds, setFocusTimeSeconds] = useState(0)
  const [userCityName, setUserCityName] = useState<string | null>(null)

  const geolocation = useGeolocation()
  const focusTimeIntervalRef = useRef<number | null>(null)

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

  const userLocation =
    geolocation.latitude !== null && geolocation.longitude !== null
      ? { latitude: geolocation.latitude, longitude: geolocation.longitude }
      : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <Radio className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">WorkOnFlight</h1>
            <Music className="h-8 w-8 text-primary" />
          </div>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Select a destination airport and focus for the flight duration to
            complete your journey
          </p>
        </motion.div>

        {/* Error Display */}
        {(error || geolocation.error) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-6 max-w-2xl"
          >
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || geolocation.error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Airport Selection */}
          <AirportSelector
            airports={airports}
            selectedAirport={selectedAirport}
            onAirportSelect={handleAirportSelect}
          />

          {/* Flight Ticket - Centered on top */}
          <FlightTicket
            airport={selectedAirport}
            userLocation={userLocation}
            userCityName={userCityName}
            flightDurationSeconds={flightDurationSeconds}
            focusTimeSeconds={focusTimeSeconds}
          />

          {/* Mixed Audio Player */}
          <MixedAudioPlayer
            airport={selectedAirport}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onError={handleError}
          />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center text-muted-foreground"
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
          <p className="mt-2 text-xs">
            Live ATC audio streams provided via CORS proxy. Some streams may be
            temporarily unavailable.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
