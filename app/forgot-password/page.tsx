'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.97) 100%), url("https://i.ibb.co/pZm8M50/37972.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="bg-yellow-400 rounded p-0.5">
            <Film size={18} className="text-black" aria-hidden="true" />
          </div>
          <span className="text-white font-bold text-base tracking-tight group-hover:text-yellow-400 transition-colors">
            Filmmart
          </span>
        </Link>
        <Link href="/" aria-label="Close" className="text-zinc-400 hover:text-white transition-colors">
          <X size={20} />
        </Link>
      </div>

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-zinc-950/95 border border-zinc-800 rounded-xl p-8 space-y-5 shadow-2xl">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto">
                <Film size={24} className="text-yellow-400" aria-hidden="true" />
              </div>
              <h1 className="text-white text-xl font-bold">Check your email</h1>
              <p className="text-zinc-400 text-sm">
                If an account exists for <span className="text-white">{email}</span>, you will
                receive a password reset link shortly.
              </p>
              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-white text-2xl font-bold">Reset Password</h1>
                <p className="text-zinc-400 text-sm mt-1">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
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

                <Button
                  type="submit"
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
                  disabled={!email}
                >
                  Send Reset Link
                </Button>
              </form>

              <p className="text-center">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
