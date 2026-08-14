import os
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

async def generate_embedding(text_content: str) -> List[float]:
    """Generates a 768-dimensional embedding using Gemini text-embedding-004 ($0 Free)."""
    if not GEMINI_API_KEY or not text_content.strip():
        return [0.0] * 768
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text_content.strip()
        )
        return result.get('embedding', [0.0] * 768)
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return [0.0] * 768

async def search_persona_memories(
    db: AsyncSession, 
    persona_id: str, 
    query: str, 
    limit: int = 4
) -> List[Dict[str, Any]]:
    """Performs HNSW cosine vector similarity search on pgvector."""
    query_vector = await generate_embedding(query)
    
    # Format query vector as string for PostgreSQL vector type
    vector_str = "[" + ",".join(map(str, query_vector)) + "]"
    
    sql_query = text("""
        SELECT 
            id, 
            source_type, 
            media_url, 
            narrative_text, 
            metadata,
            captured_at,
            1 - (embedding <=> :vector::vector) AS similarity
        FROM persona_memories
        WHERE persona_id = :persona_id
        ORDER BY embedding <=> :vector::vector
        LIMIT :limit
    """)
    
    try:
        result = await db.execute(sql_query, {
            "persona_id": persona_id,
            "vector": vector_str,
            "limit": limit
        })
        rows = result.fetchall()
        
        memories = []
        for row in rows:
            memories.append({
                "id": str(row.id),
                "source_type": row.source_type,
                "media_url": row.media_url,
                "narrative_text": row.narrative_text,
                "metadata": row.metadata or {},
                "captured_at": str(row.captured_at) if row.captured_at else None,
                "similarity": float(row.similarity) if row.similarity is not None else 0.0
            })
        return memories
    except Exception as e:
        print(f"Vector search failed (pgvector might be initial): {e}")
        return []
