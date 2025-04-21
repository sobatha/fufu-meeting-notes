"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';

export interface ProgressIndicatorProps {
  /** Current item index */
  current: number;
  /** Total items count */
  total: number;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Additional container styling */
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  showPercentage = false,
  className,
}) => {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={className}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          Item {current}/{total}
        </span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percent)}%
          </span>
        )}
      </div>
      <Progress
        value={Math.round(percent)}
        className="w-full h-2 bg-gray-200"
      />
    </div>
  );
};
