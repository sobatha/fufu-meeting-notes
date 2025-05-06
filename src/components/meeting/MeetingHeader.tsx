import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LogOutButton } from '@/components/auth/LogOutButton';

export interface MeetingHeaderProps {
  title: string;
  onBack?: () => void;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  title,
  onBack,
}) => (
  <header className="bg-white dark:bg-gray-800 shadow-sm">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {title}
        </h1>
      </div>
      <LogOutButton />
    </div>
  </header>
);
