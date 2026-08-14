'use client';
import React, { useState } from 'react';
import { Camera, Check, RefreshCw, Sparkles } from 'lucide-react';

export default function AvaturnCreator({ onAvatarExported }) {
  const [isOpen, setIsOpen] = useState(false);
  const [glbUrl, setGlbUrl] = useState('');

  const avaturnSubdomain = process.env.NEXT_PUBLIC_AVATURN_SUBDOMAIN || "demo";
  const iframeUrl = `https://${avaturnSubdomain}.avaturn.me/iframe`;

  // Listen to postMessage events from Avaturn iframe
  React.useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.source === 'avaturn' && event.data?.eventName === 'v2.avatar.exported') {
        const exportedUrl = event.data.url;
        setGlbUrl(exportedUrl);
        setIsOpen(false);
        if (onAvatarExported) {
          onAvatarExported(exportedUrl);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarExported]);

  return (
    <div className="space-y-4">
      {!isOpen ? (
        <div className="p-6 rounded-2xl plinth-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Photorealistic 3D Avatar (Avaturn.me)</span>
              </h4>
              <p className="text-xs text-stone-400">
                Generate a photorealistic 3D mesh with 52 Apple ARKit blendshapes from a single selfie.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Selfie Creator</span>
            </button>
          </div>

          {glbUrl && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span className="truncate max-w-md">✅ Avatar Ready: {glbUrl}</span>
              <button 
                onClick={() => setIsOpen(true)}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Re-create
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden plinth-card border-amber-500/30">
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-full bg-black/70 text-stone-300 hover:text-white text-xs border border-white/10"
            >
              Cancel
            </button>
          </div>
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            allow="camera *; microphone *"
            title="Avaturn 3D Creator"
          />
        </div>
      )}
    </div>
  );
}
