'use client';
import React from 'react';
import { useAuth } from '@/app/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogOutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
    </Button>
  );
}