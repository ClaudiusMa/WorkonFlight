import { useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, Headphones } from 'lucide-react'
import { AirportSelector } from './components/AirportSelector'
import { AudioPlayer } from './components/AudioPlayer'
import { AirportInfo } from './components/AirportInfo'
import { airports } from './data/airports'
import { Airport } from './types/airport'

function App() {
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAirportSelect = (airport: Airport) => {
    setSelectedAirport(airport)
    setError(null)
    // Auto-play when airport is selected
    setTimeout(() => {
      const audio = document.querySelector('audio')
      if (audio) {
        audio.play().catch((err) => {
          console.error('Auto-play failed:', err)
          setError('Auto-play is disabled. Please click play manually.')
        })
      }
    }, 500)
  }

  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <Radio className="h-8 w-8 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">Live ATC Audio</h1>
            <Headphones className="h-8 w-8 text-purple-600" />
          </div>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Listen to live air traffic control communications from the world&apos;s busiest
            airports
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p className="font-medium">⚠️ {error}</p>
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

          {/* Audio Player */}
          <AudioPlayer
            airport={selectedAirport}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onError={handleError}
          />

          {/* Airport Information */}
          <AirportInfo airport={selectedAirport} />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center text-gray-500"
        >
          <p className="text-sm">
            Audio feeds provided by{' '}
            <a
              href="https://liveatc.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700"
            >
              LiveATC.net
            </a>
          </p>
          <p className="mt-2 text-xs">
            Live ATC audio streams provided via CORS proxy. Some streams may be temporarily unavailable.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
