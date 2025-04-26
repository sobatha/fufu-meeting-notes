import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { TimerDisplay } from '@/components/common/TimerDisplay';
import { RecordingWaveform } from '@/components/common/RecordingWaveform';
import { useUserRecorder } from '@/components/recording/useUserRecorder';
import { useTranscription } from '@/components/recording/useTranscription';

export const AudioRecorder: React.FC = () => {
  const { status, startRecording, stopRecording, mediaUrl, error } = useUserRecorder();
  const isRecording = status === 'recording';
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const { transcript, isTranscribing, transcriptionError } = useTranscription(mediaUrl);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [summaryError, setSummaryError] = useState<string | null>(null);

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

  const handleSummarize = async () => {
    if (!transcript) return;
    setIsSummarizing(true);
    setSummary('');
    setDocUrl('');
    setSummaryError(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      const data = (await res.json()) as { summary?: string; docUrl?: string; error?: string };
      if (res.ok) {
        setSummary(data.summary ?? '');
        setDocUrl(data.docUrl ?? '');
      } else {
        setSummaryError(data.error || 'Summarization failed');
      }
    } catch (err: any) {
      setSummaryError(err.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        {isRecording && (
          <RecordingWaveform
            isRecording={isRecording}
            className="h-16"
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
        {isTranscribing && <p className="mt-2">Transcribing...</p>}
        {transcriptionError && <p className="text-red-500 mt-2">{transcriptionError}</p>}
        {transcript && <p className="mt-4 whitespace-pre-wrap">{transcript}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {transcript && !summary && !isSummarizing && (
          <Button onClick={handleSummarize} className="mt-4">
            Generate Summary
          </Button>
        )}
        {isSummarizing && <p className="mt-2">Generating summary...</p>}
        {summaryError && <p className="text-red-500 mt-2">{summaryError}</p>}
        {summary && (
          <>
            <h3 className="mt-4 text-lg font-semibold">Summary</h3>
            <p className="whitespace-pre-wrap">{summary}</p>
            {docUrl && (
              <a href={docUrl} target="_blank" className="text-blue-500 underline mt-2 block">
                Open in Google Docs
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};
