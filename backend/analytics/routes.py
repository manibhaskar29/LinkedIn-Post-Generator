from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from auth.dependencies import get_current_user
from db.mongodb import database
from bson import ObjectId
from typing import Optional

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


@router.get("/overview")
async def get_analytics_overview(
    days: Optional[int] = 30,
    user: str = Depends(get_current_user)
):
    """Get overall analytics for user's posts"""
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get all user posts in date range
        posts = await database.posts.find({
            "user_email": user,
            "created_at": {"$gte": start_date, "$lte": end_date}
        }).to_list(1000)
        
        if not posts:
            return {
                "total_posts": 0,
                "avg_engagement": 0,
                "total_views": 0,
                "total_clicks": 0,
                "total_shares": 0,
                "engagement_trend": []
            }
        
        # Calculate aggregates
        total_posts = len(posts)
        total_views = sum(post.get("views", 0) for post in posts)
        total_clicks = sum(post.get("clicks", 0) for post in posts)
        total_shares = sum(post.get("shares", 0) for post in posts)
        
        # Calculate average engagement (normalized score)
        engagement_scores = [post.get("engagement_score", 0) for post in posts]
        avg_engagement = sum(engagement_scores) / len(engagement_scores) if engagement_scores else 0
        
        # Build engagement trend (group by day)
        trend_data = {}
        for post in posts:
            date_key = post["created_at"].date().isoformat()
            if date_key not in trend_data:
                trend_data[date_key] = {"date": date_key, "score": 0, "count": 0}
            trend_data[date_key]["score"] += post.get("engagement_score", 0)
            trend_data[date_key]["count"] += 1
        
        engagement_trend = [
            {"date": v["date"], "score": round(v["score"] / v["count"], 2)}
            for v in sorted(trend_data.values(), key=lambda x: x["date"])
        ]
        
        return {
            "total_posts": total_posts,
            "avg_engagement": round(avg_engagement, 2),
            "total_views": total_views,
            "total_clicks": total_clicks,
            "total_shares": total_shares,
            "engagement_trend": engagement_trend
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")


@router.get("/posts/{post_id}/engagement")
async def get_post_engagement(
    post_id: str,
    user: str = Depends(get_current_user)
):
    """Get engagement metrics for a specific post"""
    try:
        post = await database.posts.find_one({
            "_id": ObjectId(post_id),
            "user_email": user
        })
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return {
            "post_id": str(post["_id"]),
            "views": post.get("views", 0),
            "clicks": post.get("clicks", 0),
            "shares": post.get("shares", 0),
            "engagement_score": post.get("engagement_score", 0)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid post ID: {str(e)}")


@router.post("/posts/{post_id}/view")
async def track_post_view(
    post_id: str,
    user: str = Depends(get_current_user)
):
    """Track a view for a post"""
    try:
        result = await database.posts.update_one(
            {"_id": ObjectId(post_id), "user_email": user},
            {"$inc": {"views": 1}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Recalculate engagement score
        await recalculate_engagement_score(post_id)
        
        return {"message": "View tracked successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error tracking view: {str(e)}")


@router.post("/posts/{post_id}/click")
async def track_post_click(
    post_id: str,
    user: str = Depends(get_current_user)
):
    """Track a click for a post"""
    try:
        result = await database.posts.update_one(
            {"_id": ObjectId(post_id), "user_email": user},
            {"$inc": {"clicks": 1}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Recalculate engagement score
        await recalculate_engagement_score(post_id)
        
        return {"message": "Click tracked successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error tracking click: {str(e)}")


@router.post("/posts/{post_id}/share")
async def track_post_share(
    post_id: str,
    user: str = Depends(get_current_user)
):
    """Track a share for a post"""
    try:
        result = await database.posts.update_one(
            {"_id": ObjectId(post_id), "user_email": user},
            {"$inc": {"shares": 1}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Recalculate engagement score
        await recalculate_engagement_score(post_id)
        
        return {"message": "Share tracked successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error tracking share: {str(e)}")


async def recalculate_engagement_score(post_id: str):
    """Recalculate engagement score based on views, clicks, and shares"""
    post = await database.posts.find_one({"_id": ObjectId(post_id)})
    
    if not post:
        return
    
    views = post.get("views", 0)
    clicks = post.get("clicks", 0)
    shares = post.get("shares", 0)
    
    # Weighted engagement score (out of 10)
    # Formula: (views * 0.1 + clicks * 0.5 + shares * 2) normalized to 0-10
    raw_score = (views * 0.1) + (clicks * 0.5) + (shares * 2)
    engagement_score = min(round(raw_score / 10, 2), 10.0)  # Cap at 10
    
    await database.posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"engagement_score": engagement_score}}
    )