from fastapi import APIRouter, Depends
from datetime import datetime
from auth.dependencies import get_current_user
from db.mongodb import database

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/schedule")
async def schedule_post(
    content: str,
    schedule_time: datetime,
    email: str = Depends(get_current_user)
):
    post = {
        "user_email": email,
        "content": content,
        "scheduled_time": schedule_time,
        "status": "scheduled",
        "retry_count": 0,
        "last_error": None,
        "created_at": datetime.utcnow(),
    }
    await database.scheduled_posts.insert_one(post)
    return {"message": "Post scheduled successfully"}
