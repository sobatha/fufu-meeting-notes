import { useState, useEffect, useTransition } from 'react';

/**
 * Automatically transcribes audio from a blob URL using Whisper.
 * Uses React startTransition for lower-priority state updates.
 */
export function useTranscription(mediaUrl: string | null) {
  const [transcript, setTranscript] = useState<string>('');
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!mediaUrl) return;
    startTransition(() => {
      setIsTranscribing(true);
      setTranscript('');
      setTranscriptionError(null);

      (async () => {
        try {
          const blob = await fetch(mediaUrl).then(res => res.blob());
          const formData = new FormData();
          formData.append('file', blob, 'recording.webm');
          const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
          const data = (await res.json()) as { transcript?: string; error?: string };
          if (res.ok) {
            setTranscript(data.transcript ?? '');
          } else {
            setTranscriptionError(data.error ?? 'Transcription failed');
          }
        } catch (err: any) {
          setTranscriptionError(err.message);
        } finally {
          setIsTranscribing(false);
        }
      })();
    });
  }, [mediaUrl]);

  return { transcript, isTranscribing: isTranscribing || isPending, transcriptionError };
}
