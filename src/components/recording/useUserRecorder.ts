'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type AudioChunk = {
  blob: Blob;
  extension: string;
}

function getExtension(mimeType: string) {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

export function useUserRecorder() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'stopped' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [newChunk, setNewChunk] = useState<AudioChunk | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const continuousRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<number | null>(null);
  const continuousChunksRef = useRef<Blob[]>([]);

  const startNextChunkRecorder = useCallback(() => {
    if (!streamRef.current) return;

    // Determine mimeType
    let mimeType = 'audio/webm';
    if (typeof MediaRecorder !== 'undefined') {
      if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
      else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
    }

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    const chunks: Blob[] = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      // Only set chunk if it actually has data
      if (blob.size > 0) {
        setNewChunk({ blob, extension: getExtension(mimeType) });
      }
    };

    recorder.start();

    // Stop previous chunk recorder if exists
    if (chunkRecorderRef.current && chunkRecorderRef.current.state === 'recording') {
      chunkRecorderRef.current.stop();
    }
    chunkRecorderRef.current = recorder;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setMediaUrl(null);
      setNewChunk(null);
      continuousChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
      }

      // 1) Continuous Recorder (for final playback)
      const continuousRecorder = new MediaRecorder(stream, { mimeType });
      continuousRecorderRef.current = continuousRecorder;
      continuousRecorder.ondataavailable = e => {
        if (e.data.size > 0) continuousChunksRef.current.push(e.data);
      };
      continuousRecorder.onstop = () => {
        const audioBlob = new Blob(continuousChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setMediaUrl(url);
        setStatus('stopped');
      };
      continuousRecorder.start();

      // 2) Chunk Recorders (for transcription)
      startNextChunkRecorder();
      intervalRef.current = window.setInterval(() => {
        startNextChunkRecorder();
      }, 30000); // 30 seconds

      setStatus('recording');
    } catch (err: unknown) {
      console.error(err);
      setError('Could not start recording. Please check microphone permissions.');
      setStatus('error');
    }
  }, [startNextChunkRecorder]);

  const stopRecording = useCallback(() => {
    if (status === 'recording') {
      if (continuousRecorderRef.current && continuousRecorderRef.current.state === 'recording') {
        continuousRecorderRef.current.stop();
      }
      if (chunkRecorderRef.current && chunkRecorderRef.current.state === 'recording') {
        chunkRecorderRef.current.stop();
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (continuousRecorderRef.current && continuousRecorderRef.current.state === 'recording') {
        continuousRecorderRef.current.stop();
      }
      if (chunkRecorderRef.current && chunkRecorderRef.current.state === 'recording') {
        chunkRecorderRef.current.stop();
      }
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { status, startRecording, stopRecording, mediaUrl, error, newChunk }
}
