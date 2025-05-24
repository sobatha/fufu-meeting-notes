'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Play, FileText, Plus, PencilRuler, Edit } from 'lucide-react';
import { MeetingHeader } from '@/components/meeting/MeetingHeader';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [isMeetingLoading, setIsMeetingLoading] = useState(false);
  const [nextMeeting, setNextMeeting] = useState({
    id: 5,
    date: '2025-06-10T21:00:00+09:00',
    status: 'scheduled'
  });
  const [recentMinutes, setRecentMinutes] = useState([
    { id: 4, date: '2025-05-15T21:00:00+09:00', title: '5月定例ミーティング' },
    { id: 3, date: '2025-04-12T20:30:00+09:00', title: '4月定例ミーティング' },
    { id: 2, date: '2025-03-08T21:00:00+09:00', title: '3月定例ミーティング' }
  ]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <MeetingHeader
          title="夫婦ミーティング"
        />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  次回のミーティング
                </CardTitle>
                <CardDescription>
                  予定されている次回のミーティング情報
                </CardDescription>
              </CardHeader>
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PencilRuler className="mr-2 h-5 w-5" />
                  振り返り項目管理
                </CardTitle>
                <CardDescription>
                  ミーティングで取り上げる項目を編集します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>健康</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>仕事</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>家庭生活</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  項目を追加
                </Button>
              </CardContent>
            </Card>


            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  過去の議事録
                </CardTitle>
                <CardDescription>
                  これまでのミーティング記録
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentMinutes.map(minutes => (
                    <div key={minutes.id} className="pt-4 first:pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium pr-4">{minutes.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(minutes.date).toLocaleDateString('ja-JP', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            閲覧
                          </Button>
                          <Button variant="ghost" size="sm">
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="ghost">すべての議事録を表示</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        </div>
      </AuthGuard>
    );
}
