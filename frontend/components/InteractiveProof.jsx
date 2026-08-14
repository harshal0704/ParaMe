'use client';
import React, { useState } from 'react';
import { Sparkles, MessageSquare, Mic, Image as ImageIcon, CheckCircle, ArrowRight, Video, Radio, Bot, ShieldCheck } from 'lucide-react';

export default function InteractiveProof() {
  const [activeTab, setActiveTab] = useState('presence');
  const [sliderPos, setSliderPos] = useState(50);

  const tabs = [
    { id: 'presence', label: '/presence', title: 'Interactive 3D Avatar vs. Dead Links' },
    { id: 'voice', label: '/voice', title: 'Sub-450ms Cloned Voice vs. Robotic TTS' },
    { id: 'memory', label: '/memory', title: 'Google Photos RAG vs. Generic AI Hallucinations' },
    { id: 'channels', label: '/channels', title: 'Omnichannel Voice Notes vs. Static Form' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. Main Interactive Proof Canvas */}
      <div className="relative w-full max-w-5xl h-[460px] rounded-3xl overflow-hidden plinth-card select-none border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
        
        {/* ==================== LEFT LAYER: BEFORE (Flaws & Anti-Patterns) ==================== */}
        <div 
          className="absolute inset-0 bg-[#090806] p-8 md:p-10 flex flex-col justify-between border-r border-white/5"
          style={{ width: `${sliderPos}%`, overflow: 'hidden' }}
        >
          <div className="w-[580px] md:w-[680px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="proof-annotation proof-annotation--flaw">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Before • Generic Links & AI Slop
              </span>
              <span className="text-[11px] font-mono text-stone-500">Traditional Personal Site</span>
            </div>

            {activeTab === 'presence' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 text-xs font-mono">
                      JPG
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-stone-300">Harshal.dev/links</div>
                      <div className="text-[11px] text-stone-500">Static link tree • 0 interaction</div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    Software engineer building distributed systems. Open for contracts. Check out my GitHub repo or book a meeting on my Calendly.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-lg bg-stone-900/60 border border-white/5 text-xs text-stone-400 flex items-center justify-between">
                      <span>Twitter / X</span> <span>↗</span>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-900/60 border border-white/5 text-xs text-stone-400 flex items-center justify-between">
                      <span>Calendly Link</span> <span>↗</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--flaw">No eye contact</span>
                  <span className="proof-annotation proof-annotation--flaw">Zero voice cadence</span>
                  <span className="proof-annotation proof-annotation--flaw">8s bounce rate</span>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <div className="text-xs font-mono text-stone-400">Visitor: "Tell me about your real-time audio pipeline."</div>
                  <div className="p-3.5 rounded-xl bg-stone-900/80 border border-white/5 text-xs text-stone-300 italic leading-relaxed">
                    "I... am... a... language... model... created... to... assist... you... with... information..."
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>Latency: 2.84s (High Jitter)</span>
                    <span>TTS: Monotone 22kHz</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--flaw">Robotic monotone</span>
                  <span className="proof-annotation proof-annotation--flaw">No VAD barge-in</span>
                  <span className="proof-annotation proof-annotation--flaw">High latency</span>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <div className="text-xs font-mono text-stone-400">Visitor: "Where did you travel last October?"</div>
                  <div className="p-3.5 rounded-xl bg-stone-900/80 border border-white/5 text-xs text-stone-400 italic">
                    "As an AI, I do not have personal memories, physical presence, or real travel experiences in October."
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--flaw">Generic boilerplate</span>
                  <span className="proof-annotation proof-annotation--flaw">No autobiographical ground-truth</span>
                </div>
              </div>
            )}

            {activeTab === 'channels' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <div className="text-xs font-semibold text-stone-300">Contact Us Form</div>
                  <input type="text" disabled placeholder="Your Email" className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-500" />
                  <textarea disabled rows={2} placeholder="Message" className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--flaw">Cold form submission</span>
                  <span className="proof-annotation proof-annotation--flaw">24-48h reply delay</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== RIGHT LAYER: AFTER (Impeccable Craft) ==================== */}
        <div 
          className="absolute inset-0 bg-[#0f0e0a] p-8 md:p-10 flex flex-col justify-between"
          style={{ left: `${sliderPos}%`, width: `${100 - sliderPos}%`, overflow: 'hidden' }}
        >
          <div className="w-[580px] md:w-[680px] -ml-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="proof-annotation proof-annotation--craft">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                After • Pavtar 3D Interactive Twin
              </span>
              <span className="text-[11px] font-mono text-amber-300/80">Photorealistic WebRTC Stage</span>
            </div>

            {activeTab === 'presence' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 backdrop-blur-xl shadow-[0_10px_30px_rgba(212,175,55,0.15)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-sm font-semibold text-white">Live 3D Twin (/u/harshal)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      Sub-450ms WebRTC
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
                    Apple ARKit 52 morph targets (`jawOpen`, `mouthSmile`), real-time eye saccades tracking visitor gaze, and natural breathing idle sway.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-black/40 border border-amber-500/20 text-amber-300 font-mono">
                      Draco GLB &lt;2.5 MB
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-black/40 border border-amber-500/20 text-amber-300 font-mono">
                      100% Free for Visitors
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--craft">Natural Eye Contact</span>
                  <span className="proof-annotation proof-annotation--craft">ARKit 52 Blendshapes</span>
                  <span className="proof-annotation proof-annotation--craft">Full-Duplex Speech</span>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-200">Cloned Voice Stream (15s WAV Calibration)</span>
                    <span className="text-[10px] font-mono text-emerald-400">TTFB: 380ms</span>
                  </div>
                  {/* Live Audio Visualizer Bars */}
                  <div className="flex items-center gap-1.5 h-8 py-1">
                    {[45, 80, 95, 60, 100, 75, 40, 85, 90, 65, 30, 95, 70, 50, 85, 100, 60, 40].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full transition-all duration-200" 
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
                    "I architected our LiveKit SFU engine with Silero VAD barge-in, allowing seamless conversational interruptions without audio stutter."
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--craft">44.1kHz Neural Audio</span>
                  <span className="proof-annotation proof-annotation--craft">VAD Barge-In</span>
                  <span className="proof-annotation proof-annotation--craft">Edge-TTS $0</span>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 backdrop-blur-xl">
                  <div className="text-xs font-mono text-amber-200/80">Visitor: "Where did you travel last October?"</div>
                  <p className="text-xs text-amber-100 font-medium leading-relaxed">
                    "I was in Kyoto exploring Fushimi Inari shrines and testing edge WebRTC nodes in Tokyo!"
                  </p>
                  {/* Photo Lightbox Preview */}
                  <div className="p-2.5 rounded-xl bg-black/50 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono text-[11px]">Google Photos: Kyoto_Shrines_2025.jpg</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">pgvector &lt;4ms</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--craft">Gemini 2.0 Flash Vision</span>
                  <span className="proof-annotation proof-annotation--craft">768-dim HNSW</span>
                </div>
              </div>
            )}

            {activeTab === 'channels' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Telegram Inbound Voice Note ➔ Outbound Voice Note</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Live</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-stone-200">
                      <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Audio Voice Note (0:14)</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono">OGG Opus</span>
                  </div>
                  <p className="text-[11px] text-amber-100/80 leading-relaxed">
                    Automatically transcribes incoming voice notes, reasons with personal memory context, and replies in your voice.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="proof-annotation proof-annotation--craft">WhatsApp Cloud API</span>
                  <span className="proof-annotation proof-annotation--craft">VIP Takeover Bridge</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== CENTRAL SEAM DIVIDER & TACTILE HANDLE ==================== */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_20px_rgba(212,175,55,0.9)] z-10 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-[#070604] border-2 border-amber-400 flex items-center justify-center text-[10px] text-amber-300 font-mono shadow-[0_0_20px_rgba(212,175,55,0.6)]">
            ↔
          </div>
        </div>

        {/* Interactive Drag Range Slider */}
        <input 
          type="range"
          min="8"
          max="92"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="proof-range-input absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Slide to compare before and after"
        />
      </div>

      {/* 2. Precision Command Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-full bg-[#12100b] border border-white/10 shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full text-xs font-mono transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-amber-400 text-black font-semibold shadow-[0_0_25px_rgba(212,175,55,0.4)]' 
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
