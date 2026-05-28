'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function MovieError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <AlertTriangle size={48} className="text-yellow-400" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-white">Failed to load movie</h1>
      <p className="text-gray-400">Check your connection and try again.</p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
