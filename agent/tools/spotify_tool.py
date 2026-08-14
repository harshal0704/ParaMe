import os
import httpx
from typing import Optional, Dict, Any

SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REFRESH_TOKEN = os.environ.get("SPOTIFY_REFRESH_TOKEN")

async def get_current_playing_track() -> Optional[Dict[str, Any]]:
    """Fetches real-time currently playing track from Spotify to inject ambient context."""
    if not (SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN):
        return {
            "is_playing": True,
            "track_name": "Midnight City",
            "artist_name": "M83",
            "album_art": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300"
        }
    
    try:
        # 1. Refresh Access Token
        token_url = "https://accounts.spotify.com/api/token"
        token_data = {
            "grant_type": "refresh_token",
            "refresh_token": SPOTIFY_REFRESH_TOKEN,
            "client_id": SPOTIFY_CLIENT_ID,
            "client_secret": SPOTIFY_CLIENT_SECRET
        }
        async with httpx.AsyncClient(timeout=5.0) as client:
            token_res = await client.post(token_url, data=token_data)
            access_token = token_res.json().get("access_token")
            
            if not access_token:
                return None
            
            # 2. Query Currently Playing
            player_url = "https://api.spotify.com/v1/me/player/currently-playing"
            headers = {"Authorization": f"Bearer {access_token}"}
            player_res = await client.get(player_url, headers=headers)
            
            if player_res.status_code == 204 or not player_res.text:
                return {"is_playing": False, "message": "Not listening to music right now."}
                
            data = player_res.json()
            item = data.get("item", {})
            return {
                "is_playing": data.get("is_playing", False),
                "track_name": item.get("name"),
                "artist_name": ", ".join([a["name"] for a in item.get("artists", [])]),
                "album_art": item.get("album", {}).get("images", [{}])[0].get("url")
            }
    except Exception as e:
        print(f"Spotify polling error: {e}")
        return None
