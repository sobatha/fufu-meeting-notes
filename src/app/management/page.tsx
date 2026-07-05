'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
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
  const [items, setItems] = useState<DiscussionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MeetingHeader
          title="夫婦ミーティング"
          onBack={() => router.push('/meeting')}
          backIcon={<Play className="h-5 w-5" />}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8">
            <ItemsManager items={items} onAdd={() => {}} onEdit={() => {}} isLoading={isLoading} />
            <MinutesHistory minutes={[]} onView={() => {}} onPDF={() => {}} onViewAll={() => {}} />
          </div>
        </main>
        </div>
      </AuthGuard>
    );
}
