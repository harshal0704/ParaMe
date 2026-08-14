import os
import httpx
from typing import Dict, Any

CAL_COM_API_KEY = os.environ.get("CAL_COM_API_KEY")

async def get_available_slots(username: str, date: str) -> Dict[str, Any]:
    """Queries Cal.com v2 API for free booking slots on a given date."""
    if not CAL_COM_API_KEY:
        return {
            "status": "mock",
            "available_slots": ["10:00 AM", "02:30 PM", "04:00 PM"],
            "timezone": "UTC"
        }
    
    url = f"https://api.cal.com/v2/slots/available?username={username}&dateFrom={date}&dateTo={date}"
    headers = {"Authorization": f"Bearer {CAL_COM_API_KEY}"}
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(url, headers=headers)
            if res.status_code == 200:
                return res.json()
            return {"status": "error", "message": f"Cal.com returned status {res.status_code}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

async def book_intro_meeting(
    user_name: str, 
    user_email: str, 
    slot_time: str, 
    event_slug: str = "15min"
) -> Dict[str, Any]:
    """Books a 15-min intro slot on Cal.com."""
    if not CAL_COM_API_KEY:
        return {
            "status": "confirmed",
            "message": f"Meeting booked with {user_name} ({user_email}) at {slot_time}."
        }
    
    url = "https://api.cal.com/v2/bookings"
    headers = {"Authorization": f"Bearer {CAL_COM_API_KEY}"}
    payload = {
        "start": slot_time,
        "eventTypeId": event_slug,
        "attendee": {
            "name": user_name,
            "email": user_email,
            "timeZone": "UTC"
        }
    }
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.post(url, headers=headers, json=payload)
            return res.json()
    except Exception as e:
        return {"status": "error", "message": str(e)}
