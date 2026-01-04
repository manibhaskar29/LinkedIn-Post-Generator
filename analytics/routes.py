from fastapi import APIRouter, Depends
from db.mongodb import database
from auth.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
async def dashboard(current_user: str = Depends(get_current_user)):
    # Total posts
    total_posts = await database.posts.count_documents({"user_email": current_user})

    # Average engagement score
    avg_cursor = database.posts.aggregate([
        {"$match": {"user_email": current_user}},
        {"$group": {"_id": None, "avg": {"$avg": "$engagement_score"}}}
    ])
    avg_result = await avg_cursor.to_list(1)
    avg_engagement_score = avg_result[0]["avg"] if avg_result else 0

    # Top tone
    tone_cursor = database.posts.aggregate([
        {"$match": {"user_email": current_user}},
        {"$group": {"_id": "$tone", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ])
    tone_result = await tone_cursor.to_list(1)
    top_tone = tone_result[0]["_id"] if tone_result else None

    return {
        "total_posts": total_posts,
        "average_engagement": round(avg_engagement_score, 2),
        "top_tone": top_tone
    }