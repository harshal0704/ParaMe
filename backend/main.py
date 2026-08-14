import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import livekit_token, voice_upload, omnichannel, personas, chat, spotify_status, tts, voice_status

app = FastAPI(
    title="ParaMe - Omnichannel AI Digital Twin & Persona API",
    description="Backend API Gateway & Real-Time WebRTC Media Token Provisioner",
    version="1.0.0"
)

frontend_origin = os.environ.get("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
allow_origins = [frontend_origin]
if frontend_origin == "http://localhost:3000":
    allow_origins.append("http://localhost:3001")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(livekit_token.router)
app.include_router(voice_upload.router)
app.include_router(omnichannel.router)
app.include_router(personas.router)
app.include_router(chat.router)
app.include_router(spotify_status.router)
app.include_router(tts.router)
app.include_router(voice_status.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "ParaMe Omnichannel Persona Engine",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
