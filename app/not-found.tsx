import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-4">
      <Film size={64} className="text-yellow-400 opacity-60" aria-hidden="true" />
      <h1 className="text-5xl font-bold text-white">404</h1>
      <p className="text-gray-400 text-lg">This page does not exist.</p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
