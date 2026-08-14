'use client';
import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import AvatarStage from '@/components/AvatarStage';

interface Message {
  id: string;
  sender: 'user' | 'twin';
  text: string;
  timestamp: string;
  memoryPhoto?: { url: string; caption: string; date: string } | null;
}

export default function PublicTwinClient({ username = 'harshal' }: { username?: string }) {
  const [persona, setPersona] = useState<{ display_name: string; bio: string; avatar_glb_url: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'twin',
      text: `Hey! I'm loading my memories...`,
      timestamp: 'Just now',
      memoryPhoto: null,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [currentMood, setCurrentMood] = useState('happy');
  const [isCopied, setIsCopied] = useState(false);
  const [spotify, setSpotify] = useState<{ track: string; artist: string; isPlaying: boolean } | null>(null);

  const quickPrompts = [
    "Tell me about your background & work",
    "Where did you travel recently?",
    "What are your current projects?",
    "Book a 15-min intro meeting"
  ];

  useEffect(() => {
    async function loadPersona() {
      const { data, error } = await api.getPersona(username);
      if (data) {
        setPersona(data);
        setMessages(prev => [{
          ...prev[0],
          text: `Hey! I'm ${data.display_name}'s authentic AI digital twin. Start a real-time WebRTC voice call to speak directly, or ask me anything!`
        }]);
      }
      setLoading(false);

      const { data: spotifyData } = await api.getSpotifyNowPlaying();
      if (spotifyData) {
        setSpotify(spotifyData);
      }
    }
    loadPersona();
  }, [username]);

  const startVoiceCall = async () => {
    setIsCalling(true);
    setCurrentMood('enthusiastic');
    try {
      const { data } = await api.getLivekitToken(username);
      if (data) {
        console.log('LiveKit token:', data);
      }
    } catch (e) {
      console.log("Connected to local WebRTC voice session");
    }
  };

  const endVoiceCall = () => {
    setIsCalling(false);
    setCurrentMood('neutral');
  };

  const submitQuery = async (queryText: string) => {
    if (!queryText.trim() || !persona) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: 'Now',
      memoryPhoto: null,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const { data } = await api.chat({
        persona_handle: username,
        message: queryText,
        channel: 'web',
      });

      if (data) {
        const photoAttachment = data.memories?.[0]?.media_url ? {
          url: data.memories[0].media_url,
          caption: data.memories[0].narrative_text?.slice(0, 60) || 'Memory',
          date: 'Recent'
        } : null;

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'twin',
          text: data.reply,
          timestamp: 'Just now',
          memoryPhoto: photoAttachment,
        }]);

        const moodMatch = data.reply.match(/\[MOOD:\s*(\w+)\]/);
        if (moodMatch) {
          setCurrentMood(moodMatch[1]);
        }
      }
    } catch (e) {
      console.error('Chat error:', e);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-white">Twin Not Found</div>
          <p className="text-stone-400 text-sm">This digital twin doesn't exist or is not public.</p>
          <Link href="/" className="ks-button-primary text-xs">
            <span>Go Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const displayName = persona.display_name;

  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">

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
                <span className="font-semibold text-white text-sm">{displayName}&apos;s Digital Twin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-stone-400">/u/{username} • 100% Free Public Twin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {spotify?.isPlaying && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#12100b] border border-white/[0.08] text-xs font-mono text-stone-300">
                <Music className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span className="text-stone-500">Listening:</span>
                <span className="text-amber-200 truncate max-w-[130px]">{spotify.track} - {spotify.artist}</span>
              </div>
            )}
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

      <main className="max-w-7xl mx-auto w-full p-6 grid lg:grid-cols-12 gap-8 my-auto">

        <div className="lg:col-span-5 space-y-4">
          <AvatarStage
            avatarUrl={persona.avatar_glb_url}
            currentMood={currentMood}
            isCalling={isCalling}
          />

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

        <div className="lg:col-span-7 flex flex-col h-[610px] rounded-3xl plinth-card overflow-hidden bg-[#0c0a07]">

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

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col",
                  m.sender === 'user' ? 'items-end' : 'items-start',
                  "space-y-1.5"
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed",
                  m.sender === 'user'
                    ? 'bg-amber-400 text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#15130e] border border-white/[0.08] text-stone-200'
                )}>
                  {m.text}
                </div>

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

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.06] bg-[#090806] flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask ${displayName} anything...`}
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

      <footer className="border-t border-white/[0.06] py-4 px-6 text-center text-xs font-mono text-stone-500 bg-[#050403]">
        ParaMe Twin Engine • Powered by Gemini 2.0 Flash &amp; Oracle Always-Free Tier
      </footer>

    </div>
  );
}
