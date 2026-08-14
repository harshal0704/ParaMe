'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Mic, 
  Layers, 
  Image as ImageIcon, 
  Radio, 
  ArrowRight, 
  Check, 
  Video, 
  ShieldCheck, 
  ExternalLink,
  Bot,
  Zap,
  Globe,
  Terminal,
  Cpu
} from 'lucide-react';
import InteractiveProof from '../components/InteractiveProof';

export default function HomePage() {
  const [activeChannel, setActiveChannel] = useState('telegram');

  const testimonials = [
    {
      quote: "My digital twin booked 4 consulting calls while I was asleep on a 14-hour flight. It feels like magic.",
      author: "Alex Rivera",
      handle: "@alexrivera_ai",
      tag: "Founder & Creator"
    },
    {
      quote: "Having my voice cloned from just a 15-second WAV and speaking over WebRTC in under 450ms is unmatched.",
      author: "Elena Rostova",
      handle: "@erostova_dev",
      tag: "Systems Architect"
    },
    {
      quote: "The Google Photos memory integration is wild. It answered questions about my Tokyo trip and showed the exact photos.",
      author: "Marcus Chen",
      handle: "@marcus_c",
      tag: "Tech Evangelist"
    },
    {
      quote: "The 100% free Oracle Always-Free + Gemini 2.0 Flash stack makes it a no-brainer. Zero cloud bills.",
      author: "David Kim",
      handle: "@dkim_builds",
      tag: "Open Source Builder"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070604] text-[#f5f1e8] selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* ========================================================================= */}
      {/* 1. KINPAKU CHROME SITE HEADER                                             */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#070604]/85 border-b border-white/[0.07] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Tag */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#070604] rounded-[7px] flex items-center justify-center">
                <span className="font-display font-extrabold text-amber-300 text-lg leading-none">P</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">Pavtar</span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300">
                v1.0
              </span>
            </div>
          </Link>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-stone-400">
            <a href="#proof" className="hover:text-amber-200 transition-colors">/proof</a>
            <a href="#avatar-engine" className="hover:text-amber-200 transition-colors">/3d-avatar</a>
            <a href="#voice-lab" className="hover:text-amber-200 transition-colors">/voice-lab</a>
            <a href="#omnichannel" className="hover:text-amber-200 transition-colors">/omnichannel</a>
            <Link href="/u/harshal" className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>/u/harshal (Free Demo)</span>
            </Link>
          </nav>

          {/* User Auth & Launch Action */}
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="ks-button-ghost text-xs"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="ks-button-primary text-xs"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH Bespoke Typography & Proof Stage                     */}
      {/* ========================================================================= */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Ambient Golden Radial Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent blur-[160px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Release Kicker Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120e] border border-amber-500/30 text-xs font-mono text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sub-450ms Full-Duplex WebRTC • ARKit 52 Blendshapes • $0 Cloud Stack</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            The digital twin that looks, talks, and remembers <br />
            <span className="ks-gold-text ks-serif-accent text-6xl md:text-8xl">exactly like you.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            Create a photorealistic 3D avatar from a single selfie, clone your voice from a 15-second WAV recording, and sync autobiographical life memories via Google Photos and pgvector.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link 
              href="/dashboard"
              className="ks-button-primary text-sm px-8 py-3.5"
            >
              <span>Create Your Twin Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/u/harshal"
              className="ks-button-ghost text-sm px-8 py-3.5 font-mono flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Talk to Live Twin (/u/harshal)</span>
            </Link>
          </div>

          {/* Full-Bleed Version Slice Banner */}
          <div className="pt-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0e0c08] border border-white/[0.08] text-xs font-mono text-stone-400">
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-bold text-[10px]">100% FREE</span>
              <span>Runs on Oracle Cloud Always-Free (1GB RAM) + Gemini 2.0 Flash + Supabase pgvector.</span>
            </div>
          </div>

          {/* Interactive Proof Stage (Before vs After) */}
          <div id="proof" className="pt-14">
            <InteractiveProof />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TESTIMONIAL MARQUEE PLINTHS                                            */}
      {/* ========================================================================= */}
      <section className="py-16 border-y border-white/[0.06] bg-[#050403] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400/80">
            /community-proof • Trusted by creators &amp; engineers worldwide
          </span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex gap-6 px-6">
            {testimonials.concat(testimonials).map((t, idx) => (
              <div 
                key={idx} 
                className="w-[380px] p-6 rounded-2xl plinth-card flex flex-col justify-between space-y-4 shrink-0"
              >
                <p className="text-xs text-stone-300 leading-relaxed font-sans italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <div>
                    <div className="font-semibold text-white">{t.author}</div>
                    <div className="text-[11px] font-mono text-stone-500">{t.handle}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SUBSYSTEM ARCHITECTURE DEEP DIVES                                      */}
      {/* ========================================================================= */}

      {/* Deep Dive 1: 3D Avatar & Blendshapes */}
      <section id="avatar-engine" className="py-24 px-6 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
              <Layers className="w-4 h-4" />
              <span>/subsystem-01 • 3D Avatar &amp; ARKit Rigging</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Photorealistic avatar. <br />
              <span className="ks-gold-text">52 Apple ARKit blendshapes.</span>
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed font-light">
              We leverage Avaturn.me to construct a rigged 3D full-body mesh from a single selfie. The Three.js stage smoothly interpolates eye gaze to follow cursor movement, randomized double-blinking, and dynamic emotional morph targets.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl plinth-interactive space-y-1">
                <div className="text-sm font-semibold text-amber-200">ARKit 52 Rig</div>
                <p className="text-[11px] text-stone-400">Lip sync visemes + emotional expressions (`jawOpen`, `mouthSmile`).</p>
              </div>
              <div className="p-4 rounded-xl plinth-interactive space-y-1">
                <div className="text-sm font-semibold text-amber-200">Draco Compressed</div>
                <p className="text-[11px] text-stone-400">Optimized GLB meshes under 2.5 MB for instant mobile loading.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl plinth-card space-y-6 bg-gradient-to-b from-[#110f0b] to-[#070604]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono text-stone-400">Active Morph Target Stream</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  60 FPS WebGL
                </span>
              </div>
              
              {/* Morph Target Bars */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>jawOpen (Speech Energy)</span>
                    <span className="text-amber-400">0.82</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[82%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>mouthSmileRight (Mood: Warm)</span>
                    <span className="text-amber-400">0.65</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[65%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>eyeBlinkLeft / Right (Perlin Noise)</span>
                    <span className="text-amber-400">0.10</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[10%]" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-stone-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>TalkingHead Three.js Renderer</span>
                </span>
                <Link href="/u/harshal" className="text-amber-300 hover:underline flex items-center gap-1">
                  <span>Test in 3D</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Deep Dive 2: In-Browser Voice Calibration Lab */}
      <section id="voice-lab" className="py-24 px-6 border-b border-white/[0.06] bg-[#090806]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="p-8 rounded-3xl plinth-card space-y-6 bg-gradient-to-b from-[#12100b] to-[#080705]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono text-white">Voice Calibration Sample (WAV)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  44.1 kHz PCM
                </span>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div className="h-20 flex items-center gap-1 p-3 rounded-2xl bg-black/50 border border-white/5">
                {[30, 60, 90, 45, 80, 100, 65, 85, 40, 95, 70, 50, 85, 100, 60, 40, 75, 90, 65, 30, 80, 55, 95, 70, 40, 85, 60, 100, 45, 80].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-amber-500 to-amber-200 rounded-full transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-stone-400 text-[10px]">DURATION</div>
                  <div className="text-white font-semibold mt-1">15.2s</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-stone-400 text-[10px]">ROUND TRIP</div>
                  <div className="text-emerald-400 font-semibold mt-1">&lt;450ms</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-stone-400 text-[10px]">CLOUD COST</div>
                  <div className="text-amber-300 font-semibold mt-1">$0.00</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
              <Mic className="w-4 h-4" />
              <span>/subsystem-02 • Zero-Cost Neural Voice Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Calibrated in 15 seconds. <br />
              <span className="ks-gold-text">Streamed in milliseconds.</span>
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed font-light">
              Record a 15-second speech sample directly in your browser. We extract your vocal resonance and cadence to synthesize streaming neural speech via Edge-TTS and Kokoro latents without paying expensive commercial voice APIs.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-stone-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pipelined punctuation chunking for sub-120ms first-audio token</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Silero VAD barge-in for natural conversational interruptions</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multilingual support across 40+ languages in your cloned tone</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Deep Dive 3: Omnichannel Hub */}
      <section id="omnichannel" className="py-24 px-6 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
              <Bot className="w-4 h-4" />
              <span>/subsystem-03 • Unified Omnichannel Router</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              One brain. Every messaging channel.
            </h2>
            <p className="text-sm text-stone-400 max-w-xl mx-auto font-light">
              Your digital twin autonomously answers inquiries on your behalf while keeping you in the loop with live VIP takeover alerts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl plinth-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Telegram
                </span>
                <span className="text-[10px] font-mono text-stone-400">Voice Notes + VIP</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Accepts incoming voice notes on Telegram, transcribes them with Groq Whisper, and replies with synthesized audio voice messages.
              </p>
            </div>

            <div className="p-6 rounded-2xl plinth-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> WhatsApp
                </span>
                <span className="text-[10px] font-mono text-stone-400">Meta Cloud API</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                1,000 free conversations/month to automatically handle customer, client, or recruiter inquiries on WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl plinth-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" /> Web Widget
                </span>
                <span className="text-[10px] font-mono text-stone-400">&lt;script /&gt;</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Embed your interactive 3D digital twin on your portfolio or company website with a single JavaScript script tag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. $0 COST MANIFESTO / PRICING SECTION                                    */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 bg-[#090806]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              /manifesto • The $0 Cloud Stack
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Why pay $500/mo when the best tools are free?
            </h2>
            <p className="text-xs text-stone-400 max-w-lg mx-auto">
              Pavtar is engineered to maximize generous free tiers without ever hitting billing walls.
            </p>
          </div>

          <div className="p-8 rounded-3xl plinth-card space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-stone-300">Oracle Always-Free VM (1GB RAM)</span>
                <span className="text-emerald-400 font-bold">$0.00 / mo</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-stone-300">Google Gemini 2.0 Flash (1M TPM)</span>
                <span className="text-emerald-400 font-bold">$0.00 / mo</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-stone-300">Groq Whisper Turbo STT API</span>
                <span className="text-emerald-400 font-bold">$0.00 / mo</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-stone-300">Edge-TTS &amp; Kokoro Audio</span>
                <span className="text-emerald-400 font-bold">$0.00 / mo</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-stone-300">Supabase / Neon PostgreSQL pgvector</span>
                <span className="text-emerald-400 font-bold">$0.00 / mo</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-stone-300">Cloudflare R2 (10 GB Zero-Egress)</span>
                <span className="text-emerald-400 font-bold">$0.00 / mo</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">Ready to create your Digital Twin?</div>
                <div className="text-xs text-amber-200/80">Deploy in under 5 minutes with Clerk Auth &amp; Docker.</div>
              </div>
              <Link href="/dashboard" className="ks-button-primary text-xs shrink-0">
                <span>Start Free Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. KINPAKU FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="py-12 px-6 border-t border-white/[0.07] bg-[#040302] text-stone-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-stone-300 font-semibold">Pavtar OS</span>
            <span>•</span>
            <span>Crafted with Impeccable Design Standards</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/u/harshal" className="hover:text-amber-300 transition-colors">/u/harshal</Link>
            <Link href="/dashboard" className="hover:text-amber-300 transition-colors">/dashboard</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
