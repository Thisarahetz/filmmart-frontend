'use client';

/* Client Component: two-step registration form (email → password) */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
        setError(data.error || 'Registration failed');
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
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>

      {/* Centered content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-white text-5xl font-bold mb-2">Register</h1>
        <h2 className="text-white text-lg mb-1">Stay up to date on upcoming movies</h2>
        <p className="text-gray-400 mb-8">Create your free account</p>

        {step === 'email' ? (
          <form onSubmit={handleEmailStep} className="flex w-full max-w-md gap-0 rounded-md overflow-hidden">
            <Label htmlFor="reg-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-none border-r-0 h-12"
            />
            <Button type="submit" className="rounded-none h-12 px-6 text-base font-semibold shrink-0">
              Get Started
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="w-full max-w-md space-y-3 text-left">
            <div className="space-y-1">
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

            <div className="space-y-1">
              <Label htmlFor="reg-email2">Email</Label>
              <Input id="reg-email2" type="email" value={email} readOnly className="opacity-60" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p role="alert" className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-sm text-gray-400 hover:text-white underline w-full text-center"
            >
              ← Change email
            </button>
          </form>
        )}

        <p className="mt-8 text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white underline hover:text-yellow-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
