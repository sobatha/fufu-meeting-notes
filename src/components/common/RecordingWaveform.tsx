"use client";

import React, { useEffect, useState } from 'react';

export interface RecordingWaveformProps {
  /** Recording state */
  isRecording: boolean;
  /** Number of bars in waveform */
  barCount?: number;
  /** Width of each bar in pixels */
  barWidth?: number;
  /** Spacing between bars in pixels */
  barSpacing?: number;
  /** Additional container class */
  className?: string;
}

export const RecordingWaveform: React.FC<RecordingWaveformProps> = ({
  isRecording,
  barCount = 20,
  barWidth = 4,
  barSpacing = 2,
  className = '',
}) => {
  const [heights, setHeights] = useState<number[]>(
    Array.from({ length: barCount }, () => 10)
  );

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isRecording) {
      id = setInterval(() => {
        setHeights(
          Array.from({ length: barCount }, () => Math.random() * 100)
        );
      }, 200);
    } else {
      setHeights(Array.from({ length: barCount }, () => 10));
    }
    return () => clearInterval(id);
  }, [isRecording, barCount]);

  return (
    <div className={`flex items-end ${className}`}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="bg-primary transition-all duration-200"
          style={{
            width: barWidth,
            height: `${h}%`,
            marginLeft: i === 0 ? 0 : barSpacing,
          }}
        />
      ))}
    </div>
  );
};
