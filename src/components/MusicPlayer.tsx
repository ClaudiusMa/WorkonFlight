import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Music,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Music2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { musicFiles } from '@/data/musicFiles'

interface MusicPlayerProps {
  isPlaying: boolean
  onPlayPause: (playing: boolean) => void
  onError?: (error: string) => void
  audioRef?: React.RefObject<HTMLAudioElement>
}

export function MusicPlayer({
  isPlaying,
  onPlayPause,
  onError,
  audioRef: externalRef,
}: MusicPlayerProps) {
  const internalRef = useRef<HTMLAudioElement>(null)
  const audioRef = externalRef || internalRef
  const [currentIndex, setCurrentIndex] = useState(0)
  const [volume, setVolume] = useState(0.4)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const currentTrack = musicFiles[currentIndex]
  const musicUrl = currentTrack ? `/music/${currentTrack.fileName}` : ''

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = (e: Event) => {
      setIsLoading(false)
      setHasError(true)
      const errorMsg = 'Music file failed to load'
      onError?.(errorMsg)
      console.error('Music error:', e)
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
  }, [onError, onPlayPause])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !musicUrl) return

    audio.load()
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing music:', error)
        setHasError(true)
      })
    }
  }, [currentIndex, isPlaying, musicUrl])

  const handleNext = () => {
    if (musicFiles.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % musicFiles.length)
  }

  const handlePrevious = () => {
    if (musicFiles.length === 0) return
    setCurrentIndex(
      (prev) => (prev - 1 + musicFiles.length) % musicFiles.length
    )
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Post-Rock Music
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Element */}
        {musicUrl && (
          <audio
            ref={audioRef}
            src={musicUrl}
            preload="auto"
            controls={false}
            autoPlay={false}
          />
        )}

        {/* Error State */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert variant="destructive">
              <Music2 className="h-4 w-4" />
              <AlertTitle>Music File Unavailable</AlertTitle>
              <AlertDescription>
                This music file failed to load. Please check your files.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Music Info & Controls */}
        {currentTrack ? (
          <motion.div
            key={`music-${currentTrack.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative space-y-4"
          >
            {/* Track Info with Album Art */}
            <div className="flex items-start gap-3">
              {/* Album Art Placeholder */}
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/40">
                  <Music2 className="h-8 w-8 text-primary/60" />
                </div>
              </div>

              {/* Track Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-left text-base font-semibold">
                  {currentTrack.name}
                </p>
                <p className="truncate text-left text-sm text-muted-foreground">
                  {currentTrack.artist}
                </p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {currentTrack.genre}
                </Badge>
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

            {/* Status and Navigation Controls - One Row */}
            <div className="flex items-center justify-between gap-2">
              {/* Status - Left */}
              {isLoading ? (
                <div className="flex items-center gap-2 text-left text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  <span>Loading music...</span>
                </div>
              ) : !hasError && currentTrack ? (
                <div className="flex items-center gap-2 text-left text-xs text-muted-foreground">
                  <Badge variant={isPlaying ? 'default' : 'outline'}>
                    {isPlaying ? 'Playing' : 'Ready'}
                  </Badge>
                </div>
              ) : null}

              {/* Navigation Controls - Right */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={isLoading || hasError}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={isLoading || hasError}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {musicFiles.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <Music2 className="mx-auto mb-4 h-16 w-16 opacity-30" />
            <p className="mb-2">No music files found</p>
            <p className="text-sm">
              Upload music files to{' '}
              <code className="rounded bg-muted px-2 py-1">public/music/</code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
