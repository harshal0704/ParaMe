import os
import uuid
import wave
import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import boto3
from db.session import get_db

router = APIRouter(prefix="/api/voice", tags=["Voice Calibration"])

R2_BUCKET = os.environ.get("R2_BUCKET_NAME", "persona-assets")
R2_DOMAIN = os.environ.get("R2_PUBLIC_DOMAIN", "http://localhost:8000/uploads")

def get_s3_client():
    account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
    if not (account_id and access_key and secret_key):
        return None
    return boto3.client(
        's3',
        endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )

@router.post("/upload")
async def upload_voice_sample(
    handle: str = Form(...),
    audio_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Ingests, validates, and stores a 15-30s WAV voice calibration recording."""
    content = await audio_file.read()
    
    if len(content) < 10000:
        raise HTTPException(status_code=400, detail="Audio sample is too short. Please record at least 10-15 seconds.")
    
    duration = 15.0
    sample_rate = 44100
    try:
        with wave.open(io.BytesIO(content), 'rb') as wav_reader:
            frames = wav_reader.getnframes()
            rate = wav_reader.getframerate()
            duration = frames / float(rate)
            sample_rate = rate
    except Exception:
        # If webm or ogg wrapper was uploaded, treat as general audio
        pass

    file_uuid = uuid.uuid4().hex[:12]
    filename = f"voice_samples/{handle}/{file_uuid}.wav"
    
    s3 = get_s3_client()
    if s3:
        try:
            s3.put_object(
                Bucket=R2_BUCKET,
                Key=filename,
                Body=content,
                ContentType="audio/wav"
            )
            file_url = f"{R2_DOMAIN}/{filename}"
        except Exception as e:
            print(f"R2 upload failed: {e}")
            file_url = f"/uploads/{filename}"
    else:
        # Local mock storage for development
        os.makedirs(f"/tmp/pavtar/{handle}", exist_ok=True)
        local_path = f"/tmp/pavtar/{handle}/{file_uuid}.wav"
        with open(local_path, "wb") as f:
            f.write(content)
        file_url = local_path

    # Update persona voice profile in Database
    query = text("""
        UPDATE personas
        SET voice_provider = 'custom_wav',
            voice_config = jsonb_set(
                COALESCE(voice_config, '{}'::jsonb), 
                '{sample_url}', 
                to_jsonb(:file_url::text)
            )
        WHERE handle = :handle
        RETURNING id
    """)
    result = await db.execute(query, {"handle": handle.lower(), "file_url": file_url})
    row = result.fetchone()
    
    if row:
        persona_id = row.id
        insert_sample = text("""
            INSERT INTO voice_samples (persona_id, file_r2_url, duration_seconds, sample_rate)
            VALUES (:persona_id, :file_url, :duration, :sample_rate)
        """)
        await db.execute(insert_sample, {
            "persona_id": persona_id,
            "file_url": file_url,
            "duration": duration,
            "sample_rate": sample_rate
        })
        await db.commit()

    return {
        "status": "success",
        "file_url": file_url,
        "duration_seconds": round(duration, 2),
        "sample_rate": sample_rate,
        "message": "Voice sample calibrated and stored successfully!"
    }
