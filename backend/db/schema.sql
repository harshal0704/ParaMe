-- ==============================================================================
-- POSTGRESQL + PGVECTOR DATABASE SCHEMA
-- Compatible with Supabase / Neon / Oracle Autonomous Postgres Free Tiers
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Personas & Digital Twins Table
CREATE TABLE IF NOT EXISTS personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id VARCHAR(100) UNIQUE,              -- Optional if self-hosted
    handle VARCHAR(50) UNIQUE NOT NULL,             -- e.g. 'harshal' for /u/harshal
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    system_prompt TEXT,
    avatar_glb_url TEXT NOT NULL,                   -- Ready Player Me / Avaturn GLB URL
    avatar_provider VARCHAR(30) DEFAULT 'avaturn',  -- 'avaturn', 'rpm', 'custom'
    voice_provider VARCHAR(30) DEFAULT 'edge_tts',  -- 'edge_tts', 'custom_wav', 'fish_audio'
    voice_config JSONB DEFAULT '{"voice": "en-US-ChristopherNeural", "pitch": "+0Hz", "rate": "+0%"}'::jsonb,
    traits JSONB DEFAULT '{"humor": 0.7, "formality": 0.3, "verbosity": 0.5}'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Multimodal Memory & Knowledge Vault (Embeddings via text-embedding-004: 768-dim)
CREATE TABLE IF NOT EXISTS persona_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    source_type VARCHAR(30) NOT NULL,              -- 'google_photos', 'notion', 'bio', 'chat'
    media_url TEXT,                                -- Cloudflare R2 image / file URL
    narrative_text TEXT NOT NULL,                  -- First-person memory description
    metadata JSONB DEFAULT '{}'::jsonb,            -- e.g. {"location": "Kyoto", "date": "2025-11"}
    embedding VECTOR(768),                         -- 768-dimensional vector
    captured_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast HNSW cosine index for sub-5ms vector similarity queries
CREATE INDEX IF NOT EXISTS idx_persona_memories_vector 
ON persona_memories USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_persona_memories_persona 
ON persona_memories (persona_id);

-- 3. Ingested Voice Samples (.wav reference files)
CREATE TABLE IF NOT EXISTS voice_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    file_r2_url TEXT NOT NULL,
    duration_seconds FLOAT NOT NULL,
    sample_rate INT DEFAULT 44100,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Omnichannel Conversation & Message Logs
CREATE TABLE IF NOT EXISTS conversation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL,                  -- 'web', 'whatsapp', 'telegram', 'discord'
    session_id VARCHAR(100) NOT NULL,
    sender_type VARCHAR(20) NOT NULL,              -- 'user', 'persona', 'human_takeover'
    message_text TEXT NOT NULL,
    is_audio BOOLEAN DEFAULT false,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_session 
ON conversation_logs (session_id, created_at);

-- 5. Human-in-the-Loop Live Takeover Sessions
CREATE TABLE IF NOT EXISTS takeover_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    triggered_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
