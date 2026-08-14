import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import livekit_token, voice_upload, omnichannel

app = FastAPI(
    title="Pavtar - Omnichannel AI Digital Twin & Persona API",
    description="Backend API Gateway & Real-Time WebRTC Media Token Provisioner",
    version="1.0.0"
)

# Enable CORS for Frontend & Embeddable Widget
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(livekit_token.router)
app.include_router(voice_upload.router)
app.include_router(omnichannel.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Pavtar Omnichannel Persona Engine",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
