'use client';

import { useState, useEffect } from 'react';
import { MeetingHeader } from '@/components/meeting/MeetingHeader';
import { PersonalNotesTab } from '@/components/meeting/PersonalNotesTab';
import { SharedNotesTab } from '@/components/meeting/SharedNotesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TimerDisplay } from '@/components/common/TimerDisplay';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DiscussionItem {
  id: string;
  name: string;
}

export default function MeetingWorkspacePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  

  const [items, setItems] = useState<DiscussionItem[]>([]);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/discussion-items');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setItems(data.items);
          } else {
            console.error('Failed to fetch items:', data.error);
          }
        } else {
          console.error('Failed to fetch items: ', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthGuard>
      <MeetingHeader
        title="2025年6月ミーティング"
        onBack={() => router.push('/management')}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="personal">個人メモ</TabsTrigger>
              <TabsTrigger value="shared">共有メモ</TabsTrigger>
            </TabsList>
            <div className="flex items-center bg-card px-4 py-2 rounded-lg">
        <Clock className="h-5 w-5 mr-2 accent-foreground" />
        <TimerDisplay
          seconds={timeLeft}
          warningThreshold={60}
          dangerThreshold={0}
          isPaused={!isTimerRunning}
          onTogglePause={() => setIsTimerRunning(prev => !prev)}
          onTimeChange={setTimeLeft}
        />
      </div>
          </div>
          <TabsContent value="personal">
            <PersonalNotesTab
              items={items}
            />
          </TabsContent>
          <TabsContent value="shared">
            <SharedNotesTab />
          </TabsContent>
        </Tabs>
      </main>
      </AuthGuard>
    </div>
  );
}
