import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Radio, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Airport } from '@/types/airport'

interface ATCAudioPlayerProps {
  airport: Airport | null
  isPlaying: boolean
  onPlayPause: (playing: boolean) => void
  onError?: (error: string) => void
  audioRef?: React.RefObject<HTMLAudioElement>
}

export function ATCAudioPlayer({
  airport,
  isPlaying,
  onPlayPause,
  onError,
  audioRef: externalRef,
}: ATCAudioPlayerProps) {
  const internalRef = useRef<HTMLAudioElement>(null)
  const audioRef = externalRef || internalRef
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => {
      console.log('ATC audio load started for:', airport?.audioUrl)
      setIsLoading(true)
      setHasError(false)
    }

    const handleCanPlay = () => {
      console.log('ATC audio can play for:', airport?.audioUrl)
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = (e: Event) => {
      setIsLoading(false)
      setHasError(true)
      console.error('ATC audio error:', e)
      onError?.(
        'ATC audio stream temporarily unavailable. This may be due to network issues or the stream being temporarily down.'
      )
    }

    const handlePlay = () => onPlayPause(true)
    const handlePause = () => onPlayPause(false)

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [onError, onPlayPause, airport])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !airport) return

    audio.load()
  }, [airport])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!airport) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Radio className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg">
              Select an airport to start listening to ATC audio
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5" />
          Live ATC Audio - {airport.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={airport.audioUrl}
          preload="none"
          controls={false}
          autoPlay={false}
        />

        {/* Error State */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>ATC Stream Unavailable</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  The audio stream is temporarily unavailable. This may be due
                  to network issues or the stream being temporarily down.
                </p>
                <p>
                  Please try again in a moment or select a different airport.
                </p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}


        {/* Airport Info & Controls */}
        <div className="relative space-y-4">
          {/* Airport Info with Icon */}
          <div className="flex items-start gap-3">
            {/* Airport Icon Placeholder */}
            <div className="flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/40">
                <Radio className="h-8 w-8 text-primary/60" />
              </div>
            </div>

            {/* Airport Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-left text-base font-semibold">
                {airport.name}
              </p>
              <p className="truncate text-left text-sm text-muted-foreground">
                {airport.code}
              </p>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              disabled={isLoading || hasError}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div className="flex flex-1 items-center gap-2">
              <Volume2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                disabled={isLoading || hasError}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
              />
            </div>
          </div>

          {/* Status - Bottom Left (matching music card position) */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="flex items-center gap-2 text-left text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <span>Connecting to ATC stream...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-left text-xs text-muted-foreground">
                <Badge
                  variant={
                    hasError
                      ? 'destructive'
                      : isPlaying
                        ? 'default'
                        : 'outline'
                  }
                >
                  {hasError ? 'Unavailable' : isPlaying ? 'Live' : 'Ready'}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
