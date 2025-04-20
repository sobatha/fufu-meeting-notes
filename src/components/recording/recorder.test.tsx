import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import Recorder from './recorder'

jest.mock('react-media-recorder', () => {
  const React = require('react');
  return {
    __esModule: true,
    useReactMediaRecorder: () => {
      const [status, setStatus] = React.useState<'idle' | 'recording' | 'stopped'>('idle');
      const startRecording = () => setStatus('recording');
      const stopRecording = () => setStatus('stopped');
      const mediaBlobUrl = null;
      const error = null;
      return { status, startRecording, stopRecording, mediaBlobUrl, error };
    },
  };
});

describe('Recorder', () => {
  test('updates status when record and stop buttons are clicked', () => {
    render(<Recorder />)
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: idle')
    fireEvent.click(screen.getByRole('button', { name: /⏺ Record/ }))
    expect(screen.getByText(/Recording/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /⏹ Stop/ }))
    expect(screen.getByText(/stopped/)).toBeInTheDocument()
  })
})
