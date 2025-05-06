'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/app/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/common/Loader';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Button onClick={() => signInWithGoogle()}>Sign in with Google</Button>
      </div>
    );
  }

  return <>{children}</>;
}
