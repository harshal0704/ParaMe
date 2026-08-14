from fastapi import APIRouter, HTTPException
import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth

router = APIRouter(prefix="/api/spotify", tags=["Spotify"])

SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REFRESH_TOKEN = os.environ.get("SPOTIFY_REFRESH_TOKEN")


@router.get("/now-playing")
async def get_now_playing():
    if not all([SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN]):
        return {"track": None, "artist": None, "isPlaying": False}

    try:
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=SPOTIFY_CLIENT_ID,
            client_secret=SPOTIFY_CLIENT_SECRET,
            redirect_uri="http://localhost:3000/callback",
            scope="user-read-currently-playing",
            open_browser=False,
        ))
        current = sp.current_user_playing_track()
        if not current or not current.get("item"):
            return {"track": None, "artist": None, "isPlaying": False}

        item = current["item"]
        return {
            "track": item["name"],
            "artist": item["artists"][0]["name"] if item.get("artists") else None,
            "isPlaying": current.get("is_playing", False),
        }
    except Exception:
        return {"track": None, "artist": None, "isPlaying": False}
