'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'email' | 'details';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep('details');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed overlay — blocks all background interaction
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Hero background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.97) 100%), url("https://i.ibb.co/pZm8M50/37972.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Top bar: Filmmart brand + close */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="bg-yellow-400 rounded p-0.5">
            <Film size={18} className="text-black" aria-hidden="true" />
          </div>
          <span className="text-white font-bold text-base tracking-tight group-hover:text-yellow-400 transition-colors">
            Filmmart
          </span>
        </Link>

        <Link
          href="/"
          aria-label="Close and go back to home"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </Link>
      </div>

      {/* Vertically centered card — scroll-safe on short viewports */}
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-zinc-950/95 border border-zinc-800 rounded-xl p-8 space-y-5 shadow-2xl">
          <div>
            <h1 className="text-white text-2xl font-bold">Create account</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {step === 'email' ? 'Join Filmmart for free' : `Creating account for ${email}`}
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleEmailStep} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email address</Label>
                <Input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
                disabled={!email}
              >
                Get Started
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  autoComplete="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email2">Email</Label>
                <Input
                  id="reg-email2"
                  type="email"
                  value={email}
                  readOnly
                  className="opacity-60 cursor-default"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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

              {error && (
                <div role="alert" className="bg-red-950/60 border border-red-700 rounded-lg px-3 py-2.5">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
                disabled={loading}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-sm text-zinc-500 hover:text-white transition-colors w-full text-center"
              >
                ← Change email
              </button>
            </form>
          )}

          <p className="text-zinc-400 text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-white underline hover:text-yellow-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
