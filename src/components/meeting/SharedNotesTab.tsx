import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const AudioRecorder = dynamic(() => import('./AudioRecorder').then(mod => mod.AudioRecorder), { ssr: false });

export interface SharedNotesTabProps {
  className?: string;
}

export const SharedNotesTab: React.FC<SharedNotesTabProps> = ({ className }) => (
  <Card className={className}>
    <CardHeader className="pb-3">
      <CardTitle className="text-xl flex justify-between items-center">
        <div className="flex space-x-2">
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <AudioRecorder />
        </div>
      </div>
    </CardContent>
  </Card>
);
