'use client';

/* Client Component: interactive login form with fetch + redirect */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        router.push(data.isAdmin ? '/admin' : '/');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), url("https://i.ibb.co/pZm8M50/37972.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5">
        <Image
          src="https://i.ibb.co/v1MXJ2B/images.jpg"
          alt="Filmmart logo"
          width={80}
          height={40}
          className="h-9 w-auto"
        />
        <Button asChild size="sm" variant="outline">
          <Link href="/register">Register</Link>
        </Button>
      </div>

      {/* Centered form */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm bg-black rounded-lg p-8 space-y-5">
          <h1 className="text-white text-2xl font-bold">Sign In</h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p role="alert" className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-gray-400 text-sm text-center">
            New to Filmmart?{' '}
            <Link href="/register" className="text-white underline hover:text-yellow-400">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
