import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About ParaMe',
  description: 'ParaMe is an omnichannel AI digital twin platform.',
};

export default function AboutPage() {
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
            About <span className="ks-gold-text ks-serif-accent">ParaMe</span>
          </h1>
          <p className="text-base text-stone-400 max-w-xl mx-auto font-light leading-relaxed">
            ParaMe is an omnichannel AI digital twin platform that lets you create a photorealistic 3D avatar,
            clone your voice, and give it autobiographical memory via Google Photos and pgvector.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl plinth-card space-y-3">
            <h3 className="text-sm font-semibold text-amber-200">3D Avatar</h3>
            <p className="text-xs text-stone-400 leading-relaxed">Apple ARKit 52 blendshapes powered by Avaturn.me. Your twin looks exactly like you.</p>
          </div>
          <div className="p-6 rounded-2xl plinth-card space-y-3">
            <h3 className="text-sm font-semibold text-amber-200">Voice Engine</h3>
            <p className="text-xs text-stone-400 leading-relaxed">Sub-450ms full-duplex WebRTC with Silero VAD, Groq Whisper, Gemini 2.0 Flash, and Edge-TTS.</p>
          </div>
          <div className="p-6 rounded-2xl plinth-card space-y-3">
            <h3 className="text-sm font-semibold text-amber-200">Memory RAG</h3>
            <p className="text-xs text-stone-400 leading-relaxed">Ingest Google Photos into pgvector with HNSW indexing. Your twin remembers your life moments.</p>
          </div>
          <div className="p-6 rounded-2xl plinth-card space-y-3">
            <h3 className="text-sm font-semibold text-amber-200">Omnichannel</h3>
            <p className="text-xs text-stone-400 leading-relaxed">Reach visitors on Telegram, WhatsApp, Discord, Email, and the web from a single brain.</p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link href="/dashboard" className="ks-button-primary text-sm px-8 py-3.5">
            <span>Create Your Twin Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
