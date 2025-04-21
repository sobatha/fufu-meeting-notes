'use client';

import { useState, useEffect } from 'react';
import { MeetingHeader } from '@/components/meeting/MeetingHeader';
import { PersonalNotesTab } from '@/components/meeting/PersonalNotesTab';
import { SharedNotesTab } from '@/components/meeting/SharedNotesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MeetingWorkspacePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<
    Record<number, { mood: 'happy'|'neutral'|'sad'; note: string }>
  >({
    1: { mood: 'neutral', note: '' },
    2: { mood: 'neutral', note: '' },
    3: { mood: 'neutral', note: '' },
  });
  
  const [sharedNotes, setSharedNotes] = useState<Record<number, string>>({
    1: '', // 健康
    2: '', // 仕事
    3: ''  // 家庭生活
  });
  const [currentItemIndex, setCurrentItemIndex] = useState(1);
  
  const items = [
    { id: 1, title: '健康' },
    { id: 2, title: '仕事' },
    { id: 3, title: '家庭生活' }
  ];

  const handleNextItem = () => {
    if (currentItemIndex < items.length) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };
  
  const handlePrevItem = () => {
    if (currentItemIndex > 1) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleMoodChange = (itemId: number, mood: 'happy' | 'neutral' | 'sad') => {
    setPersonalNotes(prev => ({
      ...prev,
      [itemId]: { mood, note: prev[itemId].note }
    }));
  };
  
  const handlePersonalNoteChange = (itemId: number, value: string) => {
    setPersonalNotes(prev => ({
      ...prev,
      [itemId]: { mood: prev[itemId].mood, note: value }
    }));
  };
  
  const handleSharedNoteChange = (itemId: number, value: string) => {
    setSharedNotes(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleSavePersonalNotes = () => {
    // Implement save logic for personal notes
  };

  const handleCompleteSharedNotes = () => {
    // Implement complete logic for shared notes
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MeetingHeader
        title="2025年6月ミーティング"
        seconds={timeLeft}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning(prev => !prev)}
        onTimeChange={setTimeLeft}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="personal">個人メモ</TabsTrigger>
              <TabsTrigger value="shared">共有メモ</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="personal">
            <PersonalNotesTab
              items={items}
              notes={items.map(item => personalNotes[item.id].note)}
              moods={items.map(item => personalNotes[item.id].mood)}
              onMoodChange={handleMoodChange}
              onNoteChange={handlePersonalNoteChange}
              onSave={handleSavePersonalNotes}
            />
          </TabsContent>
          <TabsContent value="shared">
            <SharedNotesTab
              items={items}
              notes={sharedNotes}
              currentItemIndex={currentItemIndex}
              onNoteChange={handleSharedNoteChange}
              onPrev={handlePrevItem}
              onNext={handleNextItem}
              onComplete={handleCompleteSharedNotes}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
