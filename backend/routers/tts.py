from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import edge_tts
import io
import os

router = APIRouter(prefix="/api/tts", tags=["Text-to-Speech"])

class TTSRequest(BaseModel):
    text: str
    voice: str = "en-US-ChristopherNeural"


@router.post("")
async def synthesize_speech(req: TTSRequest):
    clean_text = req.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text is required")

    try:
        communicate = edge_tts.Communicate(clean_text, req.voice)
        audio_stream = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_stream.write(chunk["data"])
        audio_bytes = audio_stream.getvalue()
        from fastapi.responses import Response
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {e}")
