import { useState, useEffect, useTransition } from 'react';
import { AudioChunk } from './useUserRecorder';

/**
 * Automatically transcribes audio from sequential chunks using Whisper.
 * Uses React startTransition for lower-priority state updates.
 */
export function useTranscription(newChunk: AudioChunk | null, isRecording: boolean) {
  const [transcript, setTranscript] = useState<string>('');
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Reset transcription when a new recording starts
  useEffect(() => {
    if (isRecording) {
      setTranscript('');
      setTranscriptionError(null);
    }
  }, [isRecording]);

  useEffect(() => {
    if (!newChunk) return;

    startTransition(() => {
      setIsTranscribing(true);

      (async () => {
        try {
          const formData = new FormData();
          formData.append('file', newChunk.blob, `chunk.${newChunk.extension}`);
          const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
          const data = (await res.json()) as { transcript?: string; error?: string };

          if (res.ok && data.transcript) {
            setTranscript(prev => {
              const st = data.transcript?.trim() || '';
              return prev ? `${prev} ${st}` : st;
            });
          } else if (!res.ok) {
            setTranscriptionError(data.error ?? 'Transcription failed');
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          setTranscriptionError(msg);
        } finally {
          setIsTranscribing(false);
        }
      })();
    });
  }, [newChunk]);

  // Allow manual reset
  const resetTranscript = () => {
    setTranscript('');
    setTranscriptionError(null);
  };

  return { transcript, isTranscribing: isTranscribing || isPending, transcriptionError, resetTranscript };
}
