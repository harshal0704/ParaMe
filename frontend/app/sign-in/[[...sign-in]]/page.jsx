import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isConfigured = clerkKey && !clerkKey.includes('placeholder');

  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Golden Ambient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 blur-[150px] pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center font-bold text-black text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            P
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Pavtar</span>
        </Link>
      </div>

      {/* Auth Card Centerpiece */}
      <div className="max-w-md mx-auto w-full flex flex-col items-center my-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-xs text-stone-400">Sign in to manage your 3D digital twin &amp; memory archive</p>
        </div>

        {isConfigured ? (
          <SignIn routing="path" path="/sign-in" />
        ) : (
          <div className="p-8 rounded-3xl plinth-card text-center space-y-4 max-w-sm w-full bg-[#0c0a07]">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
            <div className="text-sm font-semibold text-white">Developer Mode Active</div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Clerk publishable keys not set yet in <code>.env</code>. You can access the studio directly:
            </p>
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-xs block transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Enter Creator Studio ➔
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs font-mono text-stone-500">
        Pavtar Twin OS • Secured with Clerk Authentication
      </div>
    </div>
  );
}
