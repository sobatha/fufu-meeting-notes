import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MoodEmojiPicker } from '@/components/common/MoodEmojiPicker';

export interface PersonalNotesTabProps {
  items: { id: number; title: string }[];
  notes: Record<number, string>;
  moods?: Record<number, 'happy' | 'neutral' | 'sad'>;
  onMoodChange?: (itemId: number, mood: 'happy' | 'neutral' | 'sad') => void;
  onNoteChange: (itemId: number, value: string) => void;
  onSave: () => void;
  isPending: boolean;
}

export const PersonalNotesTab: React.FC<PersonalNotesTabProps> = ({
  items,
  notes,
  moods = {},
  onMoodChange,
  onNoteChange,
  onSave,
  isPending,
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-xl">個人振り返り</CardTitle>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        各項目について振り返り、メモを残してください。他の人には見えません。
      </p>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">{item.title}</h3>
              {onMoodChange && (
                <MoodEmojiPicker
                  initialMood={moods[item.id]}
                  onChange={(mood) => onMoodChange(item.id, mood)}
                />
              )}
            </div>
            <Textarea
              placeholder={`${item.title}についての振り返りを書いてください...`}
              className="min-h-32"
              value={notes[item.id] || ''}
              onChange={(e) => onNoteChange(item.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onSave} disabled={isPending}>
          {isPending ? '保存中...' : '保存'}
        </Button>
      </div>
    </CardContent>
  </Card>
);
