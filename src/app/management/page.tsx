'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { MeetingHeader } from '@/components/meeting/MeetingHeader';
import { useRouter } from 'next/navigation';
import { MinutesHistory } from '@/components/management/MinutesHistory';
import { ItemsManager } from '@/components/management/ItemsManager';

export default function Dashboard() {
  const router = useRouter();
  const [isMeetingLoading, setIsMeetingLoading] = useState(false);

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
            <ItemsManager items={[]} onAdd={() => {}} onEdit={() => {}} />
            <MinutesHistory minutes={[]} onView={() => {}} onPDF={() => {}} onViewAll={() => {}} />
          </div>
        </main>
        </div>
      </AuthGuard>
    );
}
