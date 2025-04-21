import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { TimerDisplay } from '@/components/common/TimerDisplay';
import { RecordingWaveform } from '@/components/common/RecordingWaveform';

export interface AudioRecorderProps {
  isRecording: boolean;
  recordingTime: number;
  onToggleRecording: () => void;
  onTimeChange: (seconds: number) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  recordingTime,
  onToggleRecording,
  onTimeChange,
}) => {
  
  // auto increment recordingTime handled in parent
  const handleToggle = () => {
    onToggleRecording();
    // reset time if starting
    if (!isRecording) {
      onTimeChange(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        {isRecording && (
          <RecordingWaveform
            isRecording={isRecording}
            className="h-16 w-full"
            barCount={20}
            barWidth={4}
            barSpacing={2}
          />
        )}
        <TimerDisplay
          seconds={recordingTime}
          normalClassName="text-lg font-mono"
        />
        <Button
          onClick={handleToggle}
          className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isRecording ? (
            <>
              <StopCircle className="mr-2 h-5 w-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
