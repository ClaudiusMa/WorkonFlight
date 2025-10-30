import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Airport } from '@/types/airport';

interface AudioPlayerProps {
  airport: Airport | null;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onError: (error: string) => void;
}

export function AudioPlayer({ airport, isPlaying, onPlayPause, onError }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      console.log('Audio load started for:', airport?.audioUrl);
      console.log('Audio element src:', audioRef.current?.src);
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      console.log('Audio can play for:', airport?.audioUrl);
      console.log('Audio element ready state:', audioRef.current?.readyState);
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setHasError(true);
      console.error('Audio error:', e);
      onError('Audio stream temporarily unavailable. This may be due to network issues or the stream being temporarily down. Please try again.');
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
  }, [onError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        onError('Failed to play audio. Please check your browser settings.');
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!airport) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select an airport to start listening to ATC audio</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Live ATC Audio - {airport.code}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Audio Stream Unavailable</p>
                <p className="text-sm">
                  The audio stream is temporarily unavailable. This may be due to network issues or the stream being temporarily down.
                </p>
                <p className="text-sm mt-2">
                  Please try again in a moment or select a different airport.
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 p-4"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting to audio stream...</span>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePlayPause}
              disabled={isLoading || hasError}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span className="ml-2">
                {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
              </span>
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                disabled={isLoading || hasError}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <div className="flex items-center gap-2 min-w-[120px]">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  disabled={isLoading || hasError}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p><strong>Stream:</strong> {airport.audioUrl}</p>
            <p><strong>Status:</strong> {isLoading ? 'Connecting...' : hasError ? 'Unavailable' : isPlaying ? 'Live' : 'Ready'}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
