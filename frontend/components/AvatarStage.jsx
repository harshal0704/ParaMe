'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TalkingHead } from 'talkinghead';
import { Volume2, VolumeX, Sparkles, Eye } from 'lucide-react';

export default function AvatarStage({ 
  avatarUrl = "https://models.readyplayer.me/64b58e72e1858a74e548ab09.glb",
  currentMood = "neutral",
  isCalling = false
}) {
  const containerRef = useRef(null);
  const headRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let headInstance;
    let isMounted = true;

    async function init3DAvatar() {
      if (!containerRef.current) return;
      setLoading(true);

      try {
        headInstance = new TalkingHead(containerRef.current, {
          cameraView: "upper",
          avatarMood: currentMood,
          cameraRotateEnable: true,
          lipsyncModules: ["en"],
          modelPixelRatio: Math.min(window.devicePixelRatio || 1, 2)
        });

        await headInstance.showAvatar({
          url: avatarUrl,
          body: 'M',
          dracoLoaderUrl: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        });

        if (isMounted) {
          headRef.current = headInstance;
          setLoading(false);
        }

        // Natural eye tracking on cursor movement
        const handleMouseMove = (e) => {
          if (!headRef.current) return;
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = -(e.clientY / window.innerHeight) * 2 + 1;
          headRef.current.lookAt(x * 0.25, y * 0.25, 1.0);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      } catch (err) {
        console.error("Avatar render error (fallback to standard mesh):", err);
        setLoading(false);
      }
    }

    init3DAvatar();

    return () => {
      isMounted = false;
      if (headInstance) {
        try {
          headInstance.stop();
        } catch (e) {}
      }
    };
  }, [avatarUrl]);

  // Update mood when LLM emits tags
  useEffect(() => {
    if (headRef.current && currentMood) {
      try {
        headRef.current.setMood(currentMood);
      } catch (e) {}
    }
  }, [currentMood]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden plinth-card bg-gradient-to-b from-[#0e0c09] via-[#080705] to-[#040302]">
      
      {/* 3D WebGL Canvas Mounting Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070604]/90 backdrop-blur-md space-y-4 z-20">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-mono text-amber-300/80 uppercase tracking-wider">
            Loading ARKit 3D Avatar...
          </div>
        </div>
      )}

      {/* Top Status Chrome */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="backdrop-blur-md bg-black/40 border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-stone-300 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isCalling ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isCalling ? 'Live WebRTC Full-Duplex' : '3D Avatar Active'}</span>
        </div>
        <div className="backdrop-blur-md bg-black/40 border border-white/10 px-2.5 py-1.5 rounded-full text-[11px] font-mono text-amber-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{currentMood}</span>
        </div>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-full bg-black/50 border border-white/10 text-stone-300 hover:text-white hover:bg-black/70 transition-all backdrop-blur-md"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </div>
  );
}
