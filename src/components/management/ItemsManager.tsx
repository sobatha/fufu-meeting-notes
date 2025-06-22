'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilRuler, Edit, Plus } from 'lucide-react';

interface ItemsManagerProps {
  items: { id: string; name: string }[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
}

export function ItemsManager({ items, onAdd, onEdit }: ItemsManagerProps) {
  return (
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
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span>{item.name}</span>
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(item.id)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          項目を追加
        </Button>
      </CardContent>
    </Card>
  );
}
