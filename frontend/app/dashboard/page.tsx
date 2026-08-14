'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
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
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import AvaturnCreator from '@/components/AvaturnCreator';
import VoiceRecorder from '@/components/VoiceRecorder';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('avatar');
  const [persona, setPersona] = useState<{
    id: string;
    handle: string;
    display_name: string;
    bio: string;
    system_prompt: string;
    avatar_glb_url: string;
    voice_config: Record<string, unknown>;
    traits: Record<string, unknown>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const [avatarGlb, setAvatarGlb] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [systemBio, setSystemBio] = useState('');
  const [warmth, setWarmth] = useState([80]);
  const [pacing, setPacing] = useState([50]);
  const [wit, setWit] = useState([75]);

  useEffect(() => {
    async function loadPersona() {
      if (!user) return;
      const handle = user.username || 'harshal';
      const { data } = await api.getPersona(handle);
      if (data) {
        setPersona(data);
        setAvatarGlb(data.avatar_glb_url);
        setDisplayName(data.display_name);
        setSystemBio(data.system_prompt || '');
        const traits = (data.traits as Record<string, number>) || {};
        setWarmth([Math.round((traits.humor || 0.7) * 100)]);
        setPacing([Math.round((traits.formality || 0.3) * 100)]);
        setWit([Math.round((traits.verbosity || 0.5) * 100)]);
      }
      setLoading(false);
    }
    if (isLoaded) loadPersona();
  }, [user, isLoaded]);

  const handleSave = async () => {
    if (!persona) return;
    setSaving(true);
    await api.updatePersona(persona.handle, {
      display_name: displayName,
      system_prompt: systemBio,
      avatar_glb_url: avatarGlb,
      voice_config: {
        ...persona.voice_config,
        voice: "en-US-ChristopherNeural",
      },
      traits: {
        humor: warmth[0] / 100,
        formality: pacing[0] / 100,
        verbosity: wit[0] / 100,
      },
    });
    setSaving(false);
  };

  const embedScript = `<script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://parame.harshalsp.com'}/widget.js" data-twin="${persona?.handle || 'harshal'}"></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedScript);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-white">Sign In Required</div>
          <p className="text-stone-400 text-sm">Please sign in to access your Creator Studio.</p>
          <Link href="/sign-in" className="ks-button-primary text-xs">
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const handle = user.username || 'harshal';

  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">

      <header className="border-b border-white/[0.07] bg-[#0a0806]/85 backdrop-blur-2xl px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px]">
              <div className="w-full h-full bg-[#070604] rounded-[7px] flex items-center justify-center font-bold text-amber-300 text-sm">
                P
              </div>
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-white">Creator Studio</h1>
              <p className="text-[11px] font-mono text-stone-400">
                {user.primaryEmailAddress?.emailAddress || user.firstName || 'Creator'}
              </p>
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

            <div className="pl-2 border-l border-white/10 flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 flex-1 space-y-8">

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="avatar" icon={<Layers className="w-3.5 h-3.5" />}>1. 3D Avatar (Avaturn)</TabsTrigger>
            <TabsTrigger value="voice" icon={<Mic className="w-3.5 h-3.5" />}>2. Voice Calibration</TabsTrigger>
            <TabsTrigger value="memory" icon={<Database className="w-3.5 h-3.5" />}>3. Memory Vault & RAG</TabsTrigger>
            <TabsTrigger value="channels" icon={<Bot className="w-3.5 h-3.5" />}>4. Omnichannel & Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="avatar">
            <div className="space-y-6">
              <AvaturnCreator onAvatarExported={(url) => setAvatarGlb(url)} />

              <Card>
                <CardHeader>
                  <CardTitle>Active 3D Model Configuration</CardTitle>
                  <CardDescription>Manage your ARKit 52 rigged mesh URL</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>ARKit 52 Textured Mesh URL (.GLB)</Label>
                    <Input
                      value={avatarGlb}
                      onChange={(e) => setAvatarGlb(e.target.value)}
                      placeholder="https://models.readyplayer.me/..."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="voice">
            <div className="space-y-6">
              <VoiceRecorder handle={handle} />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    Voice Traits & Latent Modulation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-stone-400 font-mono">
                      <span>Warmth & Resonance</span>
                      <span className="text-amber-300">{warmth[0]}%</span>
                    </div>
                    <Slider value={warmth} onValueChange={setWarmth} max={100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-stone-400 font-mono">
                      <span>Pacing / Cadence</span>
                      <span className="text-amber-300">{pacing[0]}%</span>
                    </div>
                    <Slider value={pacing} onValueChange={setPacing} max={100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-stone-400 font-mono">
                      <span>Wit & Conciseness</span>
                      <span className="text-amber-300">{wit[0]}%</span>
                    </div>
                    <Slider value={wit} onValueChange={setWit} max={100} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save Voice Traits'}</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="memory">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                        Autobiographical Memory Archive
                      </CardTitle>
                      <CardDescription>Connect Google Photos to automatically index life moments</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Connect Google Photos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Persona Autobiographical System Prompt</Label>
                    <Textarea
                      rows={5}
                      value={systemBio}
                      onChange={(e) => setSystemBio(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save System Prompt'}</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-amber-400" />
                        Embeddable Web Widget
                      </CardTitle>
                      <CardDescription>Add your 3D digital twin to your personal website</CardDescription>
                    </div>
                    <Button
                      onClick={copyEmbed}
                      size="sm"
                      className="text-xs"
                    >
                      {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet ? 'Copied!' : 'Copy Script Tag'}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-amber-200/90 overflow-x-auto">
                    <code>{embedScript}</code>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Telegram Bot & VIP Live Takeover</CardTitle>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Transcribes incoming voice notes and pings you on Telegram with a 1-click live takeover button whenever someone discusses hiring or contracts.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Meta WhatsApp Cloud API</CardTitle>
                      <Badge variant="secondary">Configured</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Free 1,000 service conversations/month to respond to inquiries on WhatsApp automatically.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </main>
    </div>
  );
}