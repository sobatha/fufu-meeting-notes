import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MoodEmojiPicker } from '@/components/common/MoodEmojiPicker';
import { useAuth } from '@/app/AuthContext';

export interface PersonalNotesTabProps {
  items: { id: string; name: string }[];
  moods?: Record<string, 'happy' | 'neutral' | 'sad'>;
}

export function PersonalNotesTab({
  items,
  moods = {},
}: PersonalNotesTabProps) {
  const [personalNotes, setPersonalNotes] = useState<
    Record<string, { mood: 'happy'|'neutral'|'sad'; note: string }>
  >({});

  useEffect(() => {
    setPersonalNotes(
      items.reduce((acc, item) => {
        acc[item.id] = { mood: 'neutral', note: '' };
        return acc;
      }, {} as Record<string, { mood: 'happy'|'neutral'|'sad'; note: string }>)
    );
  }, [items]);

  const userId = useAuth().user?.email;

  const handleMoodChange = (itemId: string, mood: 'happy' | 'neutral' | 'sad') => {
    setPersonalNotes(prev => ({
      ...prev,
      [itemId]: { mood, note: prev[itemId]?.note || '' }
    }));
  };
  
  const handlePersonalNoteChange = (itemId: string, value: string) => {
    setPersonalNotes(prev => ({
      ...prev,
      [itemId]: { mood: prev[itemId]?.mood || 'neutral', note: value }
    }));
  };

  const [isPending, startTransition] = useTransition();
  const handleSavePersonalNotes = async () => {
    try {
      const response = await fetch('/api/save-personal-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: personalNotes, userId }),
      });
      const { success, error } = (await response.json()) as { success: boolean; error?: string };
      if (success) {
        alert('Personal notes saved to Google Sheets!');
      } else {
        alert(`Failed to save notes: ${error}`);
      }
    } catch (error) {
      console.error('Error saving personal notes', error);
      alert('Error saving personal notes');
    }
  };

  return (
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
              <h3 className="font-medium text-lg">{item.name}</h3>
              {moods && (
                <MoodEmojiPicker
                  initialMood={moods[item.id]}
                  onChange={(mood) => handleMoodChange(item.id, mood)}
                />
              )}
            </div>
            <Textarea
              placeholder={`${item.name}についての振り返りを書いてください...`}
              className="min-h-32 bg-white"
              value={personalNotes[item.id]?.note || ''}
              onChange={(e) => handlePersonalNoteChange(item.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => startTransition(() => handleSavePersonalNotes())} disabled={isPending}>
          {isPending ? '保存中...' : '保存'}
        </Button>
      </div>
    </CardContent>
  </Card>
);
}
