'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useUserRecorder } from './useUserRecorder'

export default function Recorder() {
  const { status, startRecording, stopRecording, mediaUrl } = useUserRecorder()

  return (
    <div>
      <p>
        Status:{' '}
        {status === 'recording' ? (
          <span>Recording</span>
        ) : (
          <span>{status}</span>
        )}
      </p>
      <div className="flex gap-2">
        <Button onClick={startRecording} variant="default" >⏺ Record</Button>
        <Button onClick={stopRecording} variant="default" >⏹ Stop</Button>
        {mediaUrl && (
          <a href={mediaUrl} download="download.wav" >⬇ DL</a>
        )}
      </div>
      {mediaUrl && <audio src={mediaUrl} controls autoPlay className="w-full" />}
    </div>
  )
}
