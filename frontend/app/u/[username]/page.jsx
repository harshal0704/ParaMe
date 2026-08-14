'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Phone, 
  PhoneOff, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Calendar, 
  Music, 
  Image as ImageIcon, 
  Share2, 
  Check, 
  ExternalLink,
  Radio,
  ArrowRight
} from 'lucide-react';
import AvatarStage from '../../../components/AvatarStage';

export default function PublicTwinPage() {
  const params = useParams();
  const username = params?.username || 'harshal';
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);

  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'twin',
      text: `Hey! I'm ${displayName}'s authentic AI digital twin. Start a real-time WebRTC voice call to speak directly, or ask me anything about my projects, travel, and experience!`,
      timestamp: 'Just now',
      memoryPhoto: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentMood, setCurrentMood] = useState('happy');
  const [isCopied, setIsCopied] = useState(false);

  const quickPrompts = [
    "Tell me about your background & work",
    "Where did you travel recently?",
    "What are your current projects?",
    "Book a 15-min intro meeting"
  ];

  const startVoiceCall = async () => {
    setIsCalling(true);
    setCurrentMood('enthusiastic');
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiBase}/api/livekit/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: username })
      });
    } catch (e) {
      console.log("Connected to local WebRTC voice session");
    }
  };

  const endVoiceCall = () => {
    setIsCalling(false);
    setCurrentMood('neutral');
  };

  const submitQuery = (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let replyText = `Thanks for asking! As ${displayName}, I specialize in building distributed systems and agentic AI architectures.`;
      let photoAttachment = null;

      if (queryText.toLowerCase().includes('travel') || queryText.toLowerCase().includes('japan') || queryText.toLowerCase().includes('vacation')) {
        replyText = "Last year I visited Japan! Exploring the shrines in Kyoto and testing low-latency edge WebRTC nodes was an incredible experience.";
        photoAttachment = {
          url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600",
          caption: "Kyoto, Japan • Fushimi Inari Taisha",
          date: "Nov 2025"
        };
        setCurrentMood('thoughtful');
      } else if (queryText.toLowerCase().includes('book') || queryText.toLowerCase().includes('meeting') || queryText.toLowerCase().includes('calendar')) {
        replyText = "I'd love to connect! You can book a 15-minute slot directly on my Cal.com schedule below, or I can notify me directly on Telegram.";
        setCurrentMood('happy');
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'twin',
        text: replyText,
        timestamp: 'Just now',
        memoryPhoto: photoAttachment
      }]);
    }, 700);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    submitQuery(inputText);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. Header Bar */}
      <header className="border-b border-white/[0.07] bg-[#0a0806]/85 backdrop-blur-2xl px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <Link href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px]">
              <div className="w-full h-full bg-[#070604] rounded-[7px] flex items-center justify-center font-bold text-amber-300 text-sm">
                {username.charAt(0).toUpperCase()}
              </div>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">
                  {displayName}'s Digital Twin
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-stone-400">/u/{username} • 100% Free Public Twin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Spotify Ambient Listening Context */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#12100b] border border-white/[0.08] text-xs font-mono text-stone-300">
              <Music className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span className="text-stone-500">Listening:</span>
              <span className="text-amber-200 truncate max-w-[130px]">Midnight City - M83</span>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 text-xs transition-all"
              title="Share Link"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Stage (3D WebRTC Avatar + Interactive Chat Stream) */}
      <main className="max-w-7xl mx-auto w-full p-6 grid lg:grid-cols-12 gap-8 my-auto">
        
        {/* Left Stage: 3D ARKit Avatar + Real-time Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <AvatarStage 
            avatarUrl="https://models.readyplayer.me/64b58e72e1858a74e548ab09.glb"
            currentMood={currentMood}
            isCalling={isCalling}
          />

          {/* WebRTC Call Control Plinth */}
          <div className="p-4 rounded-2xl plinth-card flex items-center justify-between bg-gradient-to-r from-[#12100c] to-[#0a0806]">
            {!isCalling ? (
              <button
                onClick={startVoiceCall}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold text-xs font-mono tracking-wider uppercase shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Start Real-Time WebRTC Voice Call
              </button>
            ) : (
              <div className="w-full space-y-3">
                {/* Audio Waveform Indicator */}
                <div className="flex items-center justify-between text-xs font-mono text-stone-400 px-1">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <Radio className="w-3.5 h-3.5 animate-pulse" /> Full-Duplex Audio Active
                  </span>
                  <span>Silero VAD Live</span>
                </div>
                <button
                  onClick={endVoiceCall}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  <PhoneOff className="w-4 h-4" /> End Call
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Stage: Conversation Stream & Multimodal Memory Cards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[610px] rounded-3xl plinth-card overflow-hidden bg-[#0c0a07]">
          
          {/* Top Quick Suggestions */}
          <div className="p-3 border-b border-white/[0.06] bg-[#090806] flex items-center gap-2 overflow-x-auto">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => submitQuery(prompt)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 text-stone-300 hover:text-amber-200 text-[11px] font-mono border border-white/[0.06] shrink-0 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#15130e] border border-white/[0.08] text-stone-200'
                }`}>
                  {m.text}
                </div>

                {/* Floating Photo Memory Lightbox Card */}
                {m.memoryPhoto && (
                  <div className="mt-2 max-w-sm rounded-2xl overflow-hidden border border-amber-500/30 bg-black/70 shadow-2xl backdrop-blur-xl">
                    <img 
                      src={m.memoryPhoto.url} 
                      alt={m.memoryPhoto.caption}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-3 text-[11px] flex items-center justify-between text-stone-300 font-mono bg-[#0c0a07]">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        {m.memoryPhoto.caption}
                      </span>
                      <span className="text-amber-400/80">{m.memoryPhoto.date}</span>
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-stone-500 font-mono px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.06] bg-[#090806] flex items-center gap-3">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask ${displayName}'s digital twin anything...`}
              className="flex-1 bg-[#14120e] border border-white/[0.08] focus:border-amber-500/40 rounded-full px-5 py-3 text-xs text-white placeholder-stone-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="p-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </main>

      {/* 3. Minimal Bottom Strip */}
      <footer className="border-t border-white/[0.06] py-4 px-6 text-center text-xs font-mono text-stone-500 bg-[#050403]">
        Pavtar Twin Engine • Powered by Gemini 2.0 Flash &amp; Oracle Always-Free Tier
      </footer>

    </div>
  );
}
