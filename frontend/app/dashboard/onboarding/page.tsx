'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Check, Loader2, User, Mic, Image as ImageIcon, Database, Bot, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useUser } from '@clerk/nextjs';

const steps = [
  { id: 'basics', label: 'Basics', icon: User },
  { id: 'avatar', label: 'Avatar', icon: ImageIcon },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'memory', label: 'Memory', icon: Database },
  { id: 'channels', label: 'Channels', icon: Bot },
  { id: 'publish', label: 'Publish', icon: Rocket },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    handle: user?.username || '',
    display_name: user?.firstName || '',
    bio: '',
    system_prompt: '',
    avatar_glb_url: 'https://models.readyplayer.me/64b58e72e1858a74e548ab09.glb',
  });

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      setLoading(true);
      await api.updatePersona(form.handle || 'harshal', form);
      setLoading(false);
      window.location.href = '/dashboard';
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col">
      <div className="max-w-2xl mx-auto w-full p-6 flex-1 flex flex-col justify-center">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Set Up Your Digital Twin</h1>
            <p className="text-sm text-stone-400">Step {currentStep + 1} of {steps.length}</p>
          </div>

          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    idx <= currentStep ? "bg-amber-400 text-black" : "bg-white/5 text-stone-500 border border-white/10"
                  )}>
                    {idx < currentStep ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">{step.label}</span>
                </div>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].label}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Let's start with the basics of your persona."}
                {currentStep === 1 && "Choose or upload your 3D avatar."}
                {currentStep === 2 && "Record a voice sample for cloning."}
                {currentStep === 3 && "Connect your memory sources."}
                {currentStep === 4 && "Set up omnichannel integrations."}
                {currentStep === 5 && "Review and publish your twin."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStep === 0 && (
                <>
                  <div className="space-y-2">
                    <Label>Handle (URL slug)</Label>
                    <Input value={form.handle} onChange={e => update('handle', e.target.value)} placeholder="harshal" />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input value={form.display_name} onChange={e => update('display_name', e.target.value)} placeholder="Harshal" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3} placeholder="Short bio..." />
                  </div>
                </>
              )}
              {currentStep === 1 && (
                <div className="space-y-2">
                  <Label>Avatar GLB URL</Label>
                  <Input value={form.avatar_glb_url} onChange={e => update('avatar_glb_url', e.target.value)} placeholder="https://..." />
                  <p className="text-xs text-stone-500">Use Avaturn.me or Ready Player Me to generate a GLB URL.</p>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-2">
                  <Label>Voice Sample</Label>
                  <p className="text-xs text-stone-400">Record a 15-second sample in your dashboard voice tab.</p>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-2">
                  <Label>System Prompt</Label>
                  <Textarea value={form.system_prompt} onChange={e => update('system_prompt', e.target.value)} rows={4} placeholder="Describe how your twin should behave..." />
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-300">Telegram Bot</span>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-300">WhatsApp</span>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-300">Discord</span>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="space-y-3 text-xs text-stone-300">
                  <p>Handle: <span className="text-amber-300 font-mono">/{form.handle || 'harshal'}</span></p>
                  <p>Name: <span className="text-white">{form.display_name || 'Your Name'}</span></p>
                  <p>Bio: {form.bio || 'No bio set'}</p>
                  <p>Avatar: {form.avatar_glb_url ? 'Set' : 'Default'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            <Button onClick={handleNext} disabled={loading} className="text-xs">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{currentStep === steps.length - 1 ? 'Publish Twin' : 'Next'}</span>}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}