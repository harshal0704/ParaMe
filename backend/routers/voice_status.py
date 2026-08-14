from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.session import get_db

router = APIRouter(prefix="/api/voice", tags=["Voice"])

@router.get("/status")
async def get_voice_status(handle: str = Query(...), db: AsyncSession = Depends(get_db)):
    query = text("""
        SELECT vs.duration_seconds, vs.status, vs.file_r2_url
        FROM voice_samples vs
        JOIN personas p ON p.id = vs.persona_id
        WHERE p.handle = :handle AND vs.status = 'active'
        ORDER BY vs.created_at DESC
        LIMIT 1
    """)
    result = await db.execute(query, {"handle": handle.lower()})
    row = result.fetchone()

    if not row:
        return {"downloaded": False, "duration": 0, "status": "no_sample"}

    return {
        "downloaded": bool(row.file_r2_url),
        "duration": row.duration_seconds,
        "status": row.status,
    }
