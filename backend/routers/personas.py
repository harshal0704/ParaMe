from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.session import get_db

router = APIRouter(prefix="/api/personas", tags=["Personas"])

class PersonaResponse:
    pass

@router.get("/{handle}")
async def get_persona(handle: str, db: AsyncSession = Depends(get_db)):
    query = text("""
        SELECT id, handle, display_name, bio, system_prompt, avatar_glb_url,
               avatar_provider, voice_provider, voice_config, traits, social_links, is_public
        FROM personas
        WHERE handle = :handle
        LIMIT 1
    """)
    result = await db.execute(query, {"handle": handle.lower()})
    persona = result.fetchone()

    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")

    return {
        "id": str(persona.id),
        "handle": persona.handle,
        "display_name": persona.display_name,
        "bio": persona.bio,
        "system_prompt": persona.system_prompt,
        "avatar_glb_url": persona.avatar_glb_url,
        "avatar_provider": persona.avatar_provider,
        "voice_provider": persona.voice_provider,
        "voice_config": persona.voice_config,
        "traits": persona.traits,
        "social_links": persona.social_links,
        "is_public": persona.is_public,
    }

@router.get("")
async def list_personas(
    handle: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    if handle:
        query = text("SELECT id, handle, display_name, bio, avatar_glb_url, is_public FROM personas WHERE handle = :handle LIMIT 1")
        result = await db.execute(query, {"handle": handle.lower()})
        persona = result.fetchone()
        if not persona:
            raise HTTPException(status_code=404, detail="Persona not found")
        return {
            "id": str(persona.id),
            "handle": persona.handle,
            "display_name": persona.display_name,
            "bio": persona.bio,
            "avatar_glb_url": persona.avatar_glb_url,
            "is_public": persona.is_public,
        }
    else:
        query = text("SELECT id, handle, display_name, bio, avatar_glb_url, is_public FROM personas WHERE is_public = true")
        result = await db.execute(query)
        rows = result.fetchall()
        return [
            {
                "id": str(r.id),
                "handle": r.handle,
                "display_name": r.display_name,
                "bio": r.bio,
                "avatar_glb_url": r.avatar_glb_url,
                "is_public": r.is_public,
            }
            for r in rows
        ]

@router.put("/{handle}")
async def update_persona(handle: str, updates: dict, db: AsyncSession = Depends(get_db)):
    allowed_fields = {
        "display_name", "bio", "system_prompt", "avatar_glb_url",
        "voice_config", "traits", "social_links", "is_public"
    }
    set_clauses = []
    params = {"handle": handle.lower()}

    for key, value in updates.items():
        if key in allowed_fields:
            set_clauses.append(f"{key} = :{key}")
            params[key] = value

    if not set_clauses:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    set_clauses.append("updated_at = NOW()")
    sql = f"UPDATE personas SET {', '.join(set_clauses)} WHERE handle = :handle RETURNING id"
    result = await db.execute(text(sql), params)
    updated = result.fetchone()

    if not updated:
        raise HTTPException(status_code=404, detail="Persona not found")

    await db.commit()
    return {"status": "updated", "id": str(updated.id)}
