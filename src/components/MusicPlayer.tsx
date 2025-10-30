import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Volume2, VolumeX, ChevronLeft, ChevronRight, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { musicFiles } from '@/data/musicFiles';

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onError?: (error: string) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export function MusicPlayer({ isPlaying, onPlayPause, onError, audioRef: externalRef }: MusicPlayerProps) {
  const internalRef = useRef<HTMLAudioElement>(null);
  const audioRef = externalRef || internalRef;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const currentTrack = musicFiles[currentIndex];
  const musicUrl = currentTrack ? `/music/${currentTrack.fileName}` : '';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setHasError(true);
      const errorMsg = 'Music file failed to load';
      onError?.(errorMsg);
      console.error('Music error:', e);
    };

    const handlePlay = () => onPlayPause(true);
    const handlePause = () => onPlayPause(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [onError, onPlayPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicUrl) return;

    audio.load();
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing music:', error);
        setHasError(true);
      });
    }
  }, [currentIndex, isPlaying, musicUrl]);

  const handleNext = () => {
    if (musicFiles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % musicFiles.length);
  };

  const handlePrevious = () => {
    if (musicFiles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + musicFiles.length) % musicFiles.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Post-Rock Music
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
            className="flex items-center gap-6"
          >
            {/* Album Art Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <Music2 className="w-12 h-12 text-primary/60" />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-semibold text-lg">{currentTrack.name}</p>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {currentTrack.genre}
              </Badge>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={isLoading || hasError}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={isLoading || hasError}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                  disabled={isLoading || hasError}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  disabled={isLoading || hasError}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Status */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            <span>Loading music...</span>
          </div>
        )}

        {!isLoading && !hasError && currentTrack && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Badge variant={isPlaying ? 'default' : 'outline'}>
              {isPlaying ? 'Playing' : 'Ready'}
            </Badge>
            <span>{currentTrack.genre}</span>
          </div>
        )}
        
        {musicFiles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Music2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="mb-2">No music files found</p>
            <p className="text-sm">Upload music files to <code className="bg-muted px-2 py-1 rounded">public/music/</code></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

