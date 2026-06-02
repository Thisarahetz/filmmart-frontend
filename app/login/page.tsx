'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        setError(data.error ?? 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed overlay — blocks all background interaction (issue #7)
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Hero background with dark gradient (issue #6: no placeholder logo) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.97) 100%), url("https://i.ibb.co/pZm8M50/37972.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Top bar: Filmmart brand + close button (issue #2, #5, #6) */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="bg-yellow-400 rounded p-0.5">
            <Film size={18} className="text-black" aria-hidden="true" />
          </div>
          <span className="text-white font-bold text-base tracking-tight group-hover:text-yellow-400 transition-colors">
            Filmmart
          </span>
        </Link>

        {/* Close button — back to home (issue #2) */}
        <Link
          href="/"
          aria-label="Close and go back to home"
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          <X size={20} />
        </Link>
      </div>

      {/* Vertically centered card — scroll-safe on short viewports (issues #1, #10) */}
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-zinc-950/95 border border-zinc-800 rounded-xl p-8 space-y-5 shadow-2xl">
          <div>
            <h1 className="text-white text-2xl font-bold">Sign In</h1>
            <p className="text-zinc-400 text-sm mt-1">Welcome back to Filmmart</p>
          </div>

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
              {/* Label row with Forgot password link (issue #3) */}
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-zinc-400 hover:text-yellow-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Show/hide toggle (issue #4) */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Styled error state (issue #9) */}
            {error && (
              <div
                role="alert"
                className="bg-red-950/60 border border-red-700 rounded-lg px-3 py-2.5"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Only one register CTA — the top-right Register button is gone (issue #5) */}
          <p className="text-zinc-400 text-sm text-center">
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
