import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import { TimerDisplay } from '@/components/common/TimerDisplay';

export interface MeetingHeaderProps {
  title: string;
  seconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onTimeChange: (seconds: number) => void;
  onBack?: () => void;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  title,
  seconds,
  isTimerRunning,
  onToggleTimer,
  onTimeChange,
  onBack,
}) => (
  <header className="bg-white dark:bg-gray-800 shadow-sm">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {title}
        </h1>
      </div>
      <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
        <Clock className="h-5 w-5 mr-2 text-indigo-500" />
        <TimerDisplay
          seconds={seconds}
          warningThreshold={60}
          dangerThreshold={0}
          isPaused={!isTimerRunning}
          onTogglePause={onToggleTimer}
          onTimeChange={onTimeChange}
        />
      </div>
    </div>
  </header>
);
