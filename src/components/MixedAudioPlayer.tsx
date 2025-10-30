import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ATCAudioPlayer } from './ATCAudioPlayer';
import { MusicPlayer } from './MusicPlayer';
import { Airport } from '@/types/airport';

interface MixedAudioPlayerProps {
  airport: Airport | null;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onError: (error: string) => void;
  onPlayPauseHandlerReady?: (handler: () => void) => void;
  onBothAvailableChange?: (available: boolean) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function MixedAudioPlayer({ 
  airport, 
  isPlaying, 
  onPlayPause, 
  onError,
  onPlayPauseHandlerReady,
  onBothAvailableChange,
  onLoadingChange,
}: MixedAudioPlayerProps) {
  const [atcPlaying, setAtcPlaying] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [atcHasError, setAtcHasError] = useState(false);
  const [musicHasError, setMusicHasError] = useState(false);
  const atcAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);

  const handleMasterPlayPause = useCallback(() => {
    const atcAudio = atcAudioRef.current;
    const musicAudio = musicAudioRef.current;

    if (!atcAudio || !musicAudio) {
      onError('Audio elements not ready. Please select an airport first.');
      return;
    }

    if (isPlaying) {
      // Pause both
      if (!atcHasError) atcAudio.pause();
      if (!musicHasError) musicAudio.pause();
      onPlayPause(false); // Update parent state
    } else {
      // Play both (only the ones that are available)
      setIsLoading(true);
      onLoadingChange?.(true);
      const playPromises = [];
      
      if (!atcHasError && airport) {
        playPromises.push(atcAudio.play().catch((err) => {
          console.error('Error playing ATC:', err);
          setAtcHasError(true);
        }));
      }
      
      if (!musicHasError) {
        playPromises.push(musicAudio.play().catch((err) => {
          console.error('Error playing music:', err);
          setMusicHasError(true);
        }));
      }

      Promise.allSettled(playPromises).then(() => {
        setIsLoading(false);
        onLoadingChange?.(false);
        onPlayPause(true); // Update parent state
      });
    }
  }, [isPlaying, atcHasError, musicHasError, airport, onPlayPause, onError, onLoadingChange]);

  // Expose handler to parent
  useEffect(() => {
    onPlayPauseHandlerReady?.(handleMasterPlayPause);
  }, [handleMasterPlayPause, onPlayPauseHandlerReady]);

  const handleAtcPlayPause = (playing: boolean) => {
    setAtcPlaying(playing);
  };

  const handleMusicPlayPause = (playing: boolean) => {
    setMusicPlaying(playing);
  };

  const handleAtcError = (error: string) => {
    setAtcHasError(true);
    onError(error);
  };

  const handleMusicError = (error: string) => {
    setMusicHasError(true);
    onError(error);
  };

  // Check if both audio sources are available
  const bothAvailable = airport && !atcHasError && !musicHasError;

  // Notify parent of bothAvailable changes
  useEffect(() => {
    onBothAvailableChange?.(bothAvailable);
  }, [bothAvailable, onBothAvailableChange]);

  // Notify parent of loading changes
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Reset error states when airport changes
  useEffect(() => {
    setAtcHasError(false);
    setMusicHasError(false);
  }, [airport]);

  // Sync internal state with external isPlaying prop
  useEffect(() => {
    const atcAudio = atcAudioRef.current;
    const musicAudio = musicAudioRef.current;

    if (!atcAudio || !musicAudio) return;

    if (isPlaying) {
      if (!atcAudio.paused) setAtcPlaying(true);
      if (!musicAudio.paused) setMusicPlaying(true);
    } else {
      if (atcAudio.paused) setAtcPlaying(false);
      if (musicAudio.paused) setMusicPlaying(false);
    }
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Both Players */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ATCAudioPlayer
          airport={airport}
          isPlaying={atcPlaying}
          onPlayPause={handleAtcPlayPause}
          onError={handleAtcError}
          audioRef={atcAudioRef}
        />
        <MusicPlayer
          isPlaying={musicPlaying}
          onPlayPause={handleMusicPlayPause}
          onError={handleMusicError}
          audioRef={musicAudioRef}
        />
      </div>
    </motion.div>
  );
}

