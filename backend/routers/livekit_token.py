import os
import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from livekit import api
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.session import get_db

router = APIRouter(prefix="/api/livekit", tags=["LiveKit WebRTC"])

LIVEKIT_API_KEY = os.environ.get("LIVEKIT_API_KEY", "devkey")
LIVEKIT_API_SECRET = os.environ.get("LIVEKIT_API_SECRET", "secret98765432101234567890abcdef")

class TokenRequest(BaseModel):
    handle: str
    room_name: str | None = None
    participant_name: str | None = None

class TokenResponse(BaseModel):
    token: str
    room_name: str
    livekit_url: str
    avatar_glb_url: str
    display_name: str
    bio: str | None = None

@router.post("/token", response_model=TokenResponse)
async def generate_livekit_token(req: TokenRequest, db: AsyncSession = Depends(get_db)):
    """Generates an ephemeral WebRTC access token for a visitor to call a digital twin."""
    # Look up the persona by handle (e.g. 'harshal')
    query = text("""
        SELECT id, handle, display_name, bio, avatar_glb_url, system_prompt
        FROM personas 
        WHERE handle = :handle
        LIMIT 1
    """)
    result = await db.execute(query, {"handle": req.handle.lower()})
    persona = result.fetchone()
    
    # Fallback to default demo persona if not yet in DB
    avatar_url = "https://models.readyplayer.me/64b58e72e1858a74e548ab09.glb"
    display_name = req.handle.capitalize()
    bio = f"Digital Twin of {display_name}"
    persona_id = str(uuid.uuid4())
    
    if persona:
        persona_id = str(persona.id)
        avatar_url = persona.avatar_glb_url
        display_name = persona.display_name
        bio = persona.bio

    room_name = req.room_name or f"room_{req.handle}_{uuid.uuid4().hex[:8]}"
    participant_identity = req.participant_name or f"visitor_{uuid.uuid4().hex[:6]}"
    
    # Generate LiveKit JWT Token
    token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
        .with_identity(participant_identity) \
        .with_name(participant_identity) \
        .with_metadata(persona_id) \
        .with_grants(api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
            can_publish_data=True
        )).to_jwt()

    livekit_public_url = os.environ.get("NEXT_PUBLIC_LIVEKIT_URL", "ws://localhost:7880")

    return TokenResponse(
        token=token,
        room_name=room_name,
        livekit_url=livekit_public_url,
        avatar_glb_url=avatar_url,
        display_name=display_name,
        bio=bio
    )
