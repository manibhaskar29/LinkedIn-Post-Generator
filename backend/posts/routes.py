from fastapi import APIRouter, Depends
from datetime import datetime
from auth.dependencies import get_current_user
from db.mongodb import database
from posts.schemas import PostCreate
import random


router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/create")
async def create_post(post: PostCreate, user: str = Depends(get_current_user)):
    post_data = {
        "user_email": user,
        "content": post.content,
        "tone": post.tone,
        # fake engagement for now (AI / LinkedIn later)
        "engagement_score": round(random.uniform(0.5, 1.0), 2),
        "created_at": datetime.utcnow(),
    }
    result = await database.posts.insert_one(post_data)
    post_data["_id"] = str(result.inserted_id)
    post_data["created_at"] = post_data["created_at"].isoformat()
    return {"message": "Post created successfully", "post": post_data}

@router.post("/schedule")
async def schedule_post(
    post: PostCreate,
    schedule_time: datetime,
    email: str = Depends(get_current_user)
):
    post = {
        "user_email": email,
        "content": post.content,
        "scheduled_time": schedule_time,
        "status": "scheduled",
        "retry_count": 0,
        "last_error": None,
        "created_at": datetime.utcnow(),
    }
    await database.scheduled_posts.insert_one(post)
    return {"message": "Post scheduled successfully"}
