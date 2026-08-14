'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Mic, 
  Image as ImageIcon, 
  Share2, 
  Sparkles, 
  Check, 
  Code, 
  Settings, 
  ExternalLink,
  Shield,
  Bot,
  Sliders,
  Database,
  ArrowRight
} from 'lucide-react';
import AvaturnCreator from '../../components/AvaturnCreator';
import VoiceRecorder from '../../components/VoiceRecorder';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('avatar');
  const [avatarGlb, setAvatarGlb] = useState('https://models.readyplayer.me/64b58e72e1858a74e548ab09.glb');
  const [handle, setHandle] = useState('harshal');
  const [displayName, setDisplayName] = useState('Harshal');
  const [systemBio, setSystemBio] = useState('Software engineer specialized in real-time WebRTC media and agentic AI architectures.');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const embedScript = `<script src="https://yourtwin.domain/widget.js" data-twin="${handle}"></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedScript);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. Studio Header */}
      <header className="border-b border-white/[0.07] bg-[#0a0806]/85 backdrop-blur-2xl px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-[#070604] rounded-[7px] flex items-center justify-center font-bold text-amber-300 text-sm">
                P
              </div>
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-white">Creator Studio</h1>
              <p className="text-[11px] font-mono text-stone-400">Configure your 3D Digital Twin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/u/${handle}`}
              target="_blank"
              className="px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <span>View Live Twin (/u/{handle})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Canvas */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-1 space-y-8">
        
        {/* Subsystem Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0e0c09] border border-white/[0.08] w-fit shadow-md">
          {[
            { id: 'avatar', label: '1. 3D Avatar (Avaturn)', icon: Layers },
            { id: 'voice', label: '2. Voice Calibration', icon: Mic },
            { id: 'memory', label: '3. Memory Vault & RAG', icon: Database },
            { id: 'channels', label: '4. Omnichannel & Embed', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: 3D Avatar & Avaturn Studio */}
        {activeTab === 'avatar' && (
          <div className="space-y-6">
            <AvaturnCreator onAvatarExported={(url) => setAvatarGlb(url)} />

            <div className="p-6 rounded-2xl plinth-card space-y-4">
              <h3 className="text-sm font-semibold text-white">Active 3D Model Configuration</h3>
              <div className="space-y-3">
                <label className="text-xs text-stone-400 font-mono">ARKit 52 Textured Mesh URL (.GLB)</label>
                <input 
                  type="text"
                  value={avatarGlb}
                  onChange={(e) => setAvatarGlb(e.target.value)}
                  className="w-full bg-[#14120e] border border-white/[0.08] focus:border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Voice Calibration Lab */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <VoiceRecorder handle={handle} />

            <div className="p-6 rounded-2xl plinth-card space-y-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Voice Traits &amp; Latent Modulation</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-400 font-mono">
                    <span>Warmth &amp; Resonance</span>
                    <span className="text-amber-300">80%</span>
                  </div>
                  <input type="range" defaultValue="80" className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-400 font-mono">
                    <span>Pacing / Cadence</span>
                    <span className="text-amber-300">1.0x</span>
                  </div>
                  <input type="range" defaultValue="50" className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-400 font-mono">
                    <span>Wit &amp; Conciseness</span>
                    <span className="text-amber-300">75%</span>
                  </div>
                  <input type="range" defaultValue="75" className="w-full accent-amber-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Memory Vault & Google Photos RAG */}
        {activeTab === 'memory' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl plinth-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Autobiographical Memory Archive</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Connect Google Photos to automatically index life moments with Gemini 2.0 Flash Vision into pgvector.
                  </p>
                </div>
                <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-200 border border-white/[0.08] text-xs font-mono transition-all">
                  Connect Google Photos
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06] space-y-2">
                <div className="text-xs font-semibold text-amber-300 font-mono">Persona Autobiographical System Prompt</div>
                <textarea 
                  rows={5}
                  value={systemBio}
                  onChange={(e) => setSystemBio(e.target.value)}
                  className="w-full bg-[#13110c] border border-white/[0.08] rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40 font-mono leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Omnichannel & Embed Widget */}
        {activeTab === 'channels' && (
          <div className="space-y-6">
            {/* Embed Widget Generator */}
            <div className="p-6 rounded-2xl plinth-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-amber-400" />
                    <span>Embeddable Web Widget</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Add your 3D digital twin to your personal website with a single HTML script tag.
                  </p>
                </div>
                <button
                  onClick={copyEmbed}
                  className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied Snippet!' : 'Copy Script Tag'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-amber-200/90 overflow-x-auto">
                <code>{embedScript}</code>
              </div>
            </div>

            {/* Telegram & WhatsApp Connectors */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl plinth-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Telegram Bot &amp; VIP Live Takeover</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Active</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Transcribes incoming voice notes and pings you on Telegram with a 1-click live takeover button whenever someone discusses hiring or contracts.
                </p>
              </div>

              <div className="p-6 rounded-2xl plinth-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Meta WhatsApp Cloud API</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">Configured</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Free 1,000 service conversations/month to respond to inquiries on WhatsApp automatically.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
