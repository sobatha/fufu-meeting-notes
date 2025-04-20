'use client'

import { useState, useEffect } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

export function useUserRecorder() {
  const { status, startRecording, stopRecording, mediaBlobUrl, error } = useReactMediaRecorder({ audio: true })
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)

  useEffect(() => {
    if (mediaBlobUrl) {
      setMediaUrl(mediaBlobUrl)
    }
  }, [mediaBlobUrl])

  return { status, startRecording, stopRecording, mediaUrl, error }
}
