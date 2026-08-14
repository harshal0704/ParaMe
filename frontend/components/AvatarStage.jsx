'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function AvatarStage({ 
  avatarUrl = "https://models.readyplayer.me/64b58e72e1858a74e548ab09.glb",
  currentMood = "neutral",
  isCalling = false
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const sceneRef = useRef(null);
  const morphMeshesRef = useRef([]);
  const headBoneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    setLoading(true);

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 520;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 20);
    camera.position.set(0, 1.45, 1.35); // Focus on avatar upper body and face

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 2. Cinematic Kinpaku Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfef3c7, 2.2);
    keyLight.position.set(1.5, 2.5, 2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.0);
    fillLight.position.set(-1.5, 1, 1);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf5d77f, 1.8);
    rimLight.position.set(0, 2, -2);
    scene.add(rimLight);

    // 3. GLTF & Draco Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let avatarModel = null;
    const morphMeshes = [];

    loader.load(
      avatarUrl,
      (gltf) => {
        avatarModel = gltf.scene;
        avatarModel.position.set(0, 0, 0);
        scene.add(avatarModel);

        // Find morph target meshes & head bone
        avatarModel.traverse((child) => {
          if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
            morphMeshes.push(child);
          }
          if (child.isBone && (child.name.includes('Head') || child.name.includes('head'))) {
            headBoneRef.current = child;
          }
        });

        morphMeshesRef.current = morphMeshes;
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn("Avatar load fallback:", err);
        setLoading(false);
      }
    );

    // 4. Interactive Eye & Head Gaze Tracking
    let targetGazeX = 0;
    let targetGazeY = 0;
    let currentGazeX = 0;
    let currentGazeY = 0;

    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetGazeX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetGazeY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop (Idle Breathing, Randomized Blinks, Viseme Jitter)
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let nextBlinkTime = 3.0;
    let isBlinking = false;
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth eye/head gaze interpolation
      currentGazeX += (targetGazeX - currentGazeX) * 0.05;
      currentGazeY += (targetGazeY - currentGazeY) * 0.05;

      if (headBoneRef.current) {
        headBoneRef.current.rotation.y = currentGazeX * 0.25;
        headBoneRef.current.rotation.x = -currentGazeY * 0.15;
      }

      // Idle natural breathing sway
      if (avatarModel) {
        avatarModel.position.y = Math.sin(elapsedTime * 1.5) * 0.005;
      }

      // Natural randomized blinking
      blinkTimer += 0.016;
      if (blinkTimer > nextBlinkTime) {
        isBlinking = true;
        blinkTimer = 0;
        nextBlinkTime = 2.5 + Math.random() * 4.0; // Random interval between blinks
      }

      let blinkWeight = 0;
      if (isBlinking) {
        blinkWeight = Math.sin(blinkTimer * Math.PI * 8);
        if (blinkTimer > 0.15) {
          isBlinking = false;
          blinkWeight = 0;
        }
      }

      // Speech visemes simulation during call
      const speechViseme = isCalling ? Math.max(0, Math.sin(elapsedTime * 12) * 0.6) : 0;

      // Apply morph targets to ARKit meshes
      morphMeshesRef.current.forEach((mesh) => {
        const dict = mesh.morphTargetDictionary;
        const influences = mesh.morphTargetInfluences;
        if (!dict || !influences) return;

        // Blinking
        if (dict['eyeBlinkLeft'] !== undefined) influences[dict['eyeBlinkLeft']] = blinkWeight;
        if (dict['eyeBlinkRight'] !== undefined) influences[dict['eyeBlinkRight']] = blinkWeight;

        // Speech Visemes
        if (dict['jawOpen'] !== undefined) influences[dict['jawOpen']] = speechViseme;
        if (dict['mouthFunnel'] !== undefined) influences[dict['mouthFunnel']] = speechViseme * 0.4;

        // Mood Expressions
        if (dict['mouthSmileLeft'] !== undefined) {
          influences[dict['mouthSmileLeft']] = currentMood === 'happy' || currentMood === 'enthusiastic' ? 0.4 : 0.1;
        }
        if (dict['mouthSmileRight'] !== undefined) {
          influences[dict['mouthSmileRight']] = currentMood === 'happy' || currentMood === 'enthusiastic' ? 0.4 : 0.1;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, [avatarUrl, isCalling, currentMood]);

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
