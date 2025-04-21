import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AudioRecorder } from './AudioRecorder';
import { ProgressIndicator } from '@/components/common/ProgressIndicator';

export interface SharedNotesTabProps {
  items: { id: number; title: string }[];
  currentItemIndex: number;
  notes: Record<number, string>;
  isRecording: boolean;
  recordingTime: number;
  onPrev: () => void;
  onNext: () => void;
  onNoteChange: (itemId: number, value: string) => void;
  onToggleRecording: () => void;
  onTimeChange: (seconds: number) => void;
  onSave?: () => void;
  onComplete?: () => void;
}

export const SharedNotesTab: React.FC<SharedNotesTabProps> = ({
  items,
  currentItemIndex,
  notes,
  isRecording,
  recordingTime,
  onPrev,
  onNext,
  onNoteChange,
  onToggleRecording,
  onTimeChange,
  onSave,
  onComplete,
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-xl flex justify-between items-center">
        <span>共有フェーズ: {items[currentItemIndex - 1].title}</span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onPrev} disabled={currentItemIndex === 1 || isRecording}>
            前の項目
          </Button>
          <Button variant="outline" size="sm" onClick={onNext} disabled={currentItemIndex === items.length || isRecording}>
            次の項目
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <AudioRecorder
            isRecording={isRecording}
            recordingTime={recordingTime}
            onToggleRecording={onToggleRecording}
            onTimeChange={onTimeChange}
          />
          <div className="text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              録音は自動でテキスト化されます
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-lg">メモ</h3>
          <Textarea
            placeholder="議論内容や決定事項をここに書き留めてください..."
            className="min-h-56"
            value={notes[currentItemIndex] || ''}
            onChange={(e) => onNoteChange(currentItemIndex, e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={onSave}>保存</Button>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-lg mb-2">進捗状況</h3>
        <ProgressIndicator current={currentItemIndex} total={items.length} className="mt-2" />
        {currentItemIndex === items.length && (
          <div className="mt-6 flex justify-center">
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              すべての項目完了 - 議事録を生成
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
