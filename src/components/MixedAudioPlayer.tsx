import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ATCAudioPlayer } from './ATCAudioPlayer';
import { MusicPlayer } from './MusicPlayer';
import { Airport } from '@/types/airport';

interface MixedAudioPlayerProps {
  airport: Airport | null;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onError: (error: string) => void;
}

export function MixedAudioPlayer({ airport, isPlaying, onPlayPause, onError }: MixedAudioPlayerProps) {
  const [atcPlaying, setAtcPlaying] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const atcAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);

  const handleMasterPlayPause = () => {
    const atcAudio = atcAudioRef.current;
    const musicAudio = musicAudioRef.current;

    if (!atcAudio || !musicAudio) {
      onError('Audio elements not ready. Please select an airport first.');
      return;
    }

    if (isPlaying) {
      // Pause both
      atcAudio.pause();
      musicAudio.pause();
    } else {
      // Play both
      Promise.all([atcAudio.play(), musicAudio.play()])
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          onError('Failed to play audio. Please check your browser settings.');
          setIsLoading(false);
        });
      setIsLoading(true);
    }
  };

  const handleAtcPlayPause = (playing: boolean) => {
    setAtcPlaying(playing);
  };

  const handleMusicPlayPause = (playing: boolean) => {
    setMusicPlaying(playing);
  };

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
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Master Play/Pause Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleMasterPlayPause}
          disabled={isLoading || !airport}
          size="lg"
          className="w-32"
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
      </div>

      {/* Both Players */}
      <div className="space-y-4">
        <ATCAudioPlayer
          airport={airport}
          isPlaying={atcPlaying}
          onPlayPause={handleAtcPlayPause}
          onError={onError}
          audioRef={atcAudioRef}
        />
        <Separator className="my-4" />
        <MusicPlayer
          isPlaying={musicPlaying}
          onPlayPause={handleMusicPlayPause}
          onError={onError}
          audioRef={musicAudioRef}
        />
      </div>
    </motion.div>
  );
}

