import { motion } from 'framer-motion';
import { formatDuration } from '@/lib/flightCalculator';

interface FocusTimeProgressProps {
  elapsedSeconds: number;
  totalSeconds: number;
}

export function FocusTimeProgress({ elapsedSeconds, totalSeconds }: FocusTimeProgressProps) {
  const percentage = totalSeconds > 0 ? Math.min((elapsedSeconds / totalSeconds) * 100, 100) : 0;
  const isComplete = percentage >= 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">Focus Time</span>
        <span className="text-muted-foreground">
          {formatDuration(elapsedSeconds)} / {formatDuration(totalSeconds)}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isComplete
              ? 'bg-destructive'
              : 'bg-primary'
          }`}
        />
      </div>
      
      {/* Percentage Display */}
      <div className="text-xs text-center text-muted-foreground">
        {percentage.toFixed(1)}% Complete
      </div>
    </div>
  );
}

