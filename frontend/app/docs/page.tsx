import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Docs — ParaMe',
  description: 'ParaMe developer documentation.',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col">
      <header className="border-b border-white/[0.07] bg-[#0a0806]/85 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px]">
              <div className="w-full h-full bg-[#070604] rounded-[7px] flex items-center justify-center font-bold text-amber-300 text-sm">P</div>
            </div>
            <span className="font-bold text-sm text-white">ParaMe</span>
          </Link>
          <Link href="/" className="ks-button-ghost text-xs">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full p-6 py-24 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Documentation
          </h1>
          <p className="text-base text-stone-400 max-w-xl mx-auto font-light leading-relaxed">
            Learn how to deploy and customize your ParaMe digital twin.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl plinth-card space-y-2">
            <h3 className="text-sm font-semibold text-amber-200">Quick Start</h3>
            <p className="text-xs text-stone-400 leading-relaxed">Clone the repo, copy .env.example to .env, run docker compose up, and start the Next.js frontend with npm run dev.</p>
          </div>
          <div className="p-6 rounded-2xl plinth-card space-y-2">
            <h3 className="text-sm font-semibold text-amber-200">API Reference</h3>
            <p className="text-xs text-stone-400 leading-relaxed">Backend REST API at /docs (Swagger). Key endpoints: /api/personas/{handle}, /api/twin/chat, /api/livekit/token.</p>
          </div>
          <div className="p-6 rounded-2xl plinth-card space-y-2">
            <h3 className="text-sm font-semibold text-amber-200">Deployment</h3>
            <p className="text-xs text-stone-400 leading-relaxed">Frontend deploys to Cloudflare Workers via OpenNext. Backend runs in Docker on Oracle Cloud Always-Free VM behind Caddy.</p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link href="/dashboard" className="ks-button-primary text-sm px-8 py-3.5">
            <span>Go to Creator Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
