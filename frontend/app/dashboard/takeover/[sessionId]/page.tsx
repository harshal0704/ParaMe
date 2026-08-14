'use client';
import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Send, Loader2, Radio } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function TakeoverPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const [sessionId, setSessionId] = useState<string>('');
  const [personaHandle, setPersonaHandle] = useState<string>('harshal');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => {
      setSessionId(p.sessionId);
      setLoading(false);
    });
  }, [params]);

  const connectToRoom = async () => {
    const { data } = await api.getLivekitToken(personaHandle, `takeover_${sessionId}`);
    if (data) {
      setIsConnected(true);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { sender: 'human', text: inputText }]);
    setInputText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070604] text-[#f5f1e8] flex flex-col">
      <header className="border-b border-white/[0.07] bg-[#0a0806]/85 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-white">VIP Human Takeover</h1>
            <p className="text-[11px] font-mono text-stone-400">Session: {sessionId}</p>
          </div>
          <div className="flex items-center gap-3">
            {!isConnected ? (
              <Button onClick={connectToRoom} size="sm" className="text-xs">
                <Radio className="w-3.5 h-3.5" /> Connect to Room
              </Button>
            ) : (
              <Badge variant="success" className="text-xs">Connected</Badge>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full p-6 flex-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Takeover Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Persona Handle</Label>
              <Input value={personaHandle} onChange={e => setPersonaHandle(e.target.value)} />
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <p className="text-xs text-stone-400">When connected, your text replies will be spoken by the twin&apos;s TTS voice in the LiveKit room. The visitor will hear you in real-time.</p>
            </div>

            <div className="space-y-2">
              <Label>Your Reply (spoken by TTS)</Label>
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type your reply..."
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="icon" className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {messages.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {messages.map((m, i) => (
                  <div key={i} className={`text-xs p-2 rounded-lg ${m.sender === 'human' ? 'bg-amber-500/10 text-amber-200 ml-auto max-w-[80%]' : 'bg-white/5 text-stone-300'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
