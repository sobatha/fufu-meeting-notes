import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioRecorder } from './AudioRecorder';

export interface SharedNotesTabProps {}

export const SharedNotesTab: React.FC<SharedNotesTabProps> = ({}) => (
  <Card>
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
