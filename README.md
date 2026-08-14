# 🌟 Pavtar — Omnichannel AI Persona & 3D Digital Twin Platform

> **Build and deploy your photorealistic 3D interactive AI Digital Twin.**
> Featuring **Apple ARKit 52 blendshapes**, **sub-450ms real-time WebRTC audio**, **multimodal memory RAG via Google Photos & `pgvector`**, and **omnichannel presence over WhatsApp, Telegram, and Discord**.
> Engineered to run 100% on the **Oracle Cloud Always-Free Tier** (1 OCPU, 1 GB RAM, `< 350 MB` memory footprint) with **$0 cloud cost**.

---

## 💎 Features & Architecture

* **🎭 Photorealistic 3D Avatar**: Powered by **Avaturn.me** SDK with Apple ARKit 52 morph targets, eye saccades tracking cursor gaze, natural randomized blinking, and breathing sway.
* **🎙️ Sub-450ms Voice Engine**: Full-duplex WebRTC with Silero VAD barge-in, Groq Whisper Turbo STT, Google Gemini 2.0 Flash prefix-cached LLM, and streaming Edge-TTS / Kokoro synthesis.
* **🧠 Multimodal Autobiographical Memory**: Ingest Google Photos with Gemini 2.0 Flash Vision into Supabase/Neon PostgreSQL `pgvector` with HNSW indexing.
* **🌐 Omnichannel Hub**: Inbound WhatsApp Meta API, Telegram Bot with **voice note transcription and audio note reply**, Discord bot, and Resend email webhooks.
* **⚡ Live VIP Human Takeover**: If a visitor mentions hiring, contracts, or emergencies, your Telegram receives an instant alert with a 1-click live web takeover button.
* **🔒 Clerk Authentication**: Seamless multi-user SaaS onboarding at `/dashboard`, while public twin profiles (e.g. `/u/harshal`) remain **100% free and open to all visitors**.
* **📦 Embeddable Portfolio Widget**: Add your twin to your personal website with a single `<script>` tag.

---

## 🏛️ $0 Cloud Stack Matrix

| Service | Provider & Tier | Cost |
| :--- | :--- | :--- |
| **Compute & SFU** | Oracle Cloud Always-Free AMD VM (1 OCPU, 1 GB RAM) | **$0.00** |
| **LLM Reasoning** | Google Gemini 2.0 Flash (Google AI Studio: 15 RPM / 1M TPM) | **$0.00** |
| **STT Transcriber** | Groq Whisper-Large-v3-Turbo API | **$0.00** |
| **TTS & Voice** | Edge-TTS (Unlimited Neural Audio) / Kokoro-82M | **$0.00** |
| **Relational & Vectors**| Self-Hosted PostgreSQL 16 + `pgvector` (24/7 Permanent, Never Sleeps) | **$0.00** |
| **Object Storage** | Cloudflare R2 (10 GB Free, Zero Egress Fees) | **$0.00** |
| **Authentication** | Clerk (10,000 Monthly Active Users Free) | **$0.00** |
| **Edge Ingress** | Cloudflare Tunnel & Caddy Automated SSL | **$0.00** |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/your-username/pavtar.git
cd pavtar
cp .env.example .env
# Fill in GEMINI_API_KEY, GROQ_API_KEY, and CLERK keys in .env
```

### 2. Launch Backend & Voice Agent (Docker Compose)
```bash
docker compose up --build -d
```

### 3. Launch Next.js 15 Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit:
* **Landing Page:** `http://localhost:3000` (Impeccable.style aesthetic)
* **Creator Studio:** `http://localhost:3000/dashboard`
* **Public Digital Twin:** `http://localhost:3000/u/harshal`

---

## ☁️ Oracle Cloud 1GB VM Setup (< 350 MB RAM)

Run the included automated setup script on your Oracle Always-Free VM:
```bash
chmod +x scripts/setup_vm.sh
./scripts/setup_vm.sh
```
This automatically:
1. Allocates a **2GB swapfile** to prevent any out-of-memory errors.
2. Tunes Linux kernel swappiness and virtual memory pressure.
3. Installs Docker and starts the lean container stack.

---

## 📜 License
MIT License • Built with ❤️ for open-source AI builders.
