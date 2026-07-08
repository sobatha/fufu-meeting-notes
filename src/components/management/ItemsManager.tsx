'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilRuler, Edit, Plus } from 'lucide-react';
import { Loader } from '@/components/common/Loader';

interface ItemsManagerProps {
  items: { id: string; name: string }[];
  onAdd?: () => void;
  onEdit?: (id: string, newName: string) => Promise<void>;
  isLoading?: boolean;
}

export function ItemsManager({ items, onAdd, onEdit, isLoading }: ItemsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSave = async (id: string) => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      if (onEdit) {
        await onEdit(id, editName);
      }
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
  };

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
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[52px]">
                  {editingId === item.id ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary bg-white dark:text-white"
                        disabled={isSaving}
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleSave(item.id)} disabled={isSaving || !editName.trim()}>
                        {isSaving ? '保存中...' : '保存'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isSaving}>
                        キャンセル
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span>{item.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleStartEdit(item.id, item.name)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              項目を追加
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
