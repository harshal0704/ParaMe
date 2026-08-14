import os
import httpx
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TELEGRAM_ADMIN_CHAT_ID = os.environ.get("TELEGRAM_ADMIN_CHAT_ID")
APP_URL = os.environ.get("NEXT_PUBLIC_APP_URL", "http://localhost:3000")

VIP_TRIGGERS = [
    "hire", "contract", "consulting", "job", "urgent", "emergency", 
    "invest", "interview", "call me", "speak with human", "real person"
]

async def check_and_trigger_vip_takeover(
    db: AsyncSession,
    persona_id: str,
    persona_name: str,
    session_id: str,
    channel: str,
    user_message: str
) -> bool:
    """Checks if message contains VIP intent and triggers Telegram alert to the twin creator."""
    is_vip = any(trigger in user_message.lower() for trigger in VIP_TRIGGERS)
    if not is_vip or not TELEGRAM_BOT_TOKEN or not TELEGRAM_ADMIN_CHAT_ID:
        return False
    
    # Check if session is already under takeover
    query = text("SELECT is_active FROM takeover_sessions WHERE session_id = :session_id")
    result = await db.execute(query, {"session_id": session_id})
    row = result.fetchone()
    
    if not row:
        insert_query = text("""
            INSERT INTO takeover_sessions (session_id, persona_id, channel, is_active, triggered_by)
            VALUES (:session_id, :persona_id, :channel, true, :triggered_by)
            ON CONFLICT (session_id) DO NOTHING
        """)
        await db.execute(insert_query, {
            "session_id": session_id,
            "persona_id": persona_id,
            "channel": channel,
            "triggered_by": user_message[:200]
        })
        await db.commit()

    # Send Rich Telegram Alert with 1-Click Takeover Button
    takeover_url = f"{APP_URL}/dashboard/takeover/{session_id}"
    alert_text = (
        f"🚨 <b>VIP Lead Alert for {persona_name}!</b>\n\n"
        f"<b>Channel:</b> #{channel.upper()}\n"
        f"<b>Session ID:</b> <code>{session_id}</code>\n"
        f"<b>User Said:</b> \"<i>{user_message}</i>\"\n\n"
        f"AI auto-pilot paused. Click below to take over the conversation live:"
    )

    telegram_api = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_ADMIN_CHAT_ID,
        "text": alert_text,
        "parse_mode": "HTML",
        "reply_markup": {
            "inline_keyboard": [
                [{"text": "⚡ Take Over Live in Browser", "url": takeover_url}]
            ]
        }
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            await client.post(telegram_api, json=payload)
        return True
    except Exception as e:
        print(f"Failed to send Telegram VIP takeover alert: {e}")
        return False
