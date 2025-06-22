'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface Minute {
  id: number;
  date: string;
  title: string;
}

interface MinutesHistoryProps {
  minutes: Minute[];
  onView?: (id: number) => void;
  onPDF?: (id: number) => void;
  onViewAll?: () => void;
}

export function MinutesHistory({ minutes, onView, onPDF, onViewAll }: MinutesHistoryProps) {
  return (
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
          {minutes.map(m => (
            <div key={m.id} className="pt-4 first:pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium pr-4">{m.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(m.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onView?.(m.id)}>
                    閲覧
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onPDF?.(m.id)}>
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="ghost" onClick={onViewAll}>
          すべての議事録を表示
        </Button>
      </CardFooter>
    </Card>
  );
}
