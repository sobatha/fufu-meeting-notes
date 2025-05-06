import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

export interface TimerDisplayProps {
  /** Current time in seconds */
  seconds: number;
  /** Threshold for warning color (in seconds) */
  warningThreshold?: number;
  /** Threshold for danger color (in seconds) */
  dangerThreshold?: number;
  /** Tailwind class for normal state */
  normalClassName?: string;
  /** Tailwind class for warning state */
  warningClassName?: string;
  /** Tailwind class for danger state */
  dangerClassName?: string;
  /** Pause state */
  isPaused?: boolean;
  /** Toggle pause callback */
  onTogglePause?: () => void;
  /** Time change callback */
  onTimeChange?: (seconds: number) => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  seconds,
  warningThreshold = 60,
  dangerThreshold = 30,
  normalClassName = 'text-secondary-foreground',
  warningClassName = 'text-accent-foreground',
  dangerClassName = 'text-destructive-foreground',
  isPaused = false,
  onTogglePause,
  onTimeChange,
}) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // sync input with display
  const [inputValue, setInputValue] = useState(formatted);
  useEffect(() => { setInputValue(formatted); }, [formatted]);

  // countdown effect: decrease time when running
  useEffect(() => {
    if (!onTimeChange) return;
    let timerId: NodeJS.Timeout;
    // start countdown if not paused
    if (!isPaused && seconds > 0) {
      timerId = setInterval(() => {
        onTimeChange(seconds - 1);
      }, 1000);
    } else if (seconds === 0 && !isPaused) {
      // auto-pause when reaching zero
      onTogglePause?.();
    }
    return () => clearInterval(timerId);
  }, [seconds, isPaused, onTimeChange, onTogglePause]);

  let colorClass = normalClassName;

  if (seconds <= dangerThreshold) {
    colorClass = dangerClassName;
  } else if (seconds <= warningThreshold) {
    colorClass = warningClassName;
  }

  // handle user edits
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputBlur = () => {
    const match = inputValue.match(/^(\d+):(\d{2})$/);
    if (match && onTimeChange) {
      const total = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      onTimeChange(total);
    } else {
      setInputValue(formatted);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className={`font-mono text-lg ${colorClass} w-16 text-center bg-transparent focus:outline-none`}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />
      {onTogglePause && (
        <Button
          size="sm"
          variant="outline"
          className="hover:bg-secondary"
          onClick={onTogglePause}
        >
          {isPaused ? <Play className="h-4 w-4 text-accent" /> : <Pause className="h-4 w-4 text-destructive" />}
        </Button>
      )}
    </div>
  );
};
