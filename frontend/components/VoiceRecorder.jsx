'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

export default function VoiceRecorder({ handle = "harshal", onUploadSuccess }) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop media tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone permission error:", err);
      alert("Please allow microphone permissions to record your voice calibration sample.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const uploadVoiceSample = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('handle', handle);
    formData.append('audio_file', audioBlob, 'calibration_sample.wav');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/voice/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ success: true, message: data.message });
        if (onUploadSuccess) onUploadSuccess(data.file_url);
      } else {
        setUploadStatus({ success: false, message: data.detail || 'Upload failed' });
      }
    } catch (err) {
      setUploadStatus({ success: false, message: 'Server connection error.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl plinth-card space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400" />
            <span>Voice Calibration Lab (15–30s Sample)</span>
          </h4>
          <p className="text-xs text-stone-400">
            Read a natural sentence for 15 seconds to calibrate your cloned voice pitch, warmth, and cadence.
          </p>
        </div>
        <div className="font-mono text-xs text-amber-300">
          {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')} / 0:30
        </div>
      </div>

      {/* Suggested Calibration Prompt */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-stone-300 italic leading-relaxed">
        "Hi, I'm recording my voice to calibrate my digital twin. I enjoy building high-performance systems, collaborating with global teams, and exploring innovative technology."
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Mic className="w-4 h-4" /> Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-400 text-white font-semibold text-xs flex items-center gap-2 transition-all animate-pulse"
          >
            <Square className="w-4 h-4" /> Stop Recording ({duration}s)
          </button>
        )}

        {audioUrl && !isRecording && (
          <>
            <audio src={audioUrl} controls className="h-9 rounded-full max-w-[240px]" />
            <button
              onClick={uploadVoiceSample}
              disabled={isUploading}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Save Voice Sample'}
            </button>
          </>
        )}
      </div>

      {/* Upload Status Alert */}
      {uploadStatus && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          uploadStatus.success 
            ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300' 
            : 'bg-red-950/30 border border-red-500/30 text-red-300'
        }`}>
          {uploadStatus.success ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{uploadStatus.message}</span>
        </div>
      )}
    </div>
  );
}
