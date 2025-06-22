'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { MeetingHeader } from '@/components/meeting/MeetingHeader';
import { useRouter } from 'next/navigation';
import { MinutesHistory } from '@/components/management/MinutesHistory';
import { ItemsManager } from '@/components/management/ItemsManager';

interface DiscussionItem {
  id: string;
  name: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isMeetingLoading, setIsMeetingLoading] = useState(false);
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
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MeetingHeader
          title="夫婦ミーティング"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8">
            <Card className="lg:col-span-2">
              <CardContent>
                <div className="flex justify-center">
                  <Button size="lg" onClick={() => {
                    router.push('/meeting');
                    setIsMeetingLoading(true);
                    }} disabled={isMeetingLoading}>
                    ミーティングを開始
                    <Play className="ml-2 h-4 w-4" />
                  </Button>
                </div> 
              </CardContent>
            </Card>
            <ItemsManager items={items} onAdd={() => {}} onEdit={() => {}} />
            <MinutesHistory minutes={[]} onView={() => {}} onPDF={() => {}} onViewAll={() => {}} />
          </div>
        </main>
        </div>
      </AuthGuard>
    );
}
