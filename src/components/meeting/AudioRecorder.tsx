import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { TimerDisplay } from '@/components/common/TimerDisplay';
import { RecordingWaveform } from '@/components/common/RecordingWaveform';
import { useUserRecorder } from '@/components/recording/useUserRecorder';

export const AudioRecorder: React.FC = () => {
  const { status, startRecording, stopRecording, mediaUrl, error } = useUserRecorder();
  const isRecording = status === 'recording';
  const [recordingTime, setRecordingTime] = useState<number>(0);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const handleToggle = () => {
    if (!isRecording) {
      setRecordingTime(0);
      startRecording();
    } else {
      stopRecording();
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
        {mediaUrl && !isRecording && (
          <audio controls src={mediaUrl} className="mt-4" />
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};
