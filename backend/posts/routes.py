from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import Optional
from auth.dependencies import get_current_user
from db.mongodb import database
from posts.schemas import PostCreate, PostUpdate
from bson import ObjectId
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


@router.get("/all")
async def get_all_posts(
    user: str = Depends(get_current_user),
    search: Optional[str] = None,
    tone: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    min_score: Optional[float] = None,
    is_favorite: Optional[bool] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc"
):
    """Get all posts with optional search, filtering, and sorting"""
    # Build query
    query = {"user_email": user}
    
    # Add search filter
    if search:
        query["content"] = {"$regex": search, "$options": "i"}
    
    # Add tone filter
    if tone:
        query["tone"] = tone
    
    # Add favorite filter
    if is_favorite is not None:
        query["is_favorite"] = is_favorite
    
    # Add engagement score filter
    if min_score is not None:
        query["engagement_score"] = {"$gte": min_score}
    
    # Add date range filter
    if date_from or date_to:
        date_query = {}
        if date_from:
            date_query["$gte"] = datetime.fromisoformat(date_from)
        if date_to:
            date_query["$lte"] = datetime.fromisoformat(date_to)
        if date_query:
            query["created_at"] = date_query
    
    # Determine sort direction
    sort_direction = -1 if sort_order == "desc" else 1
    
    # Get posts with filters and sorting
    posts = await database.posts.find(query).sort(sort_by, sort_direction).to_list(100)
    
    for post in posts:
        post["_id"] = str(post["_id"])
        post["created_at"] = post["created_at"].isoformat()
        if "updated_at" in post:
            post["updated_at"] = post["updated_at"].isoformat()
    
    return posts

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

@router.get("/{post_id}")
async def get_post(post_id: str, user: str = Depends(get_current_user)):
    """Get a single post by ID"""
    try:
        post = await database.posts.find_one({
            "_id": ObjectId(post_id),
            "user_email": user
        })
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        post["_id"] = str(post["_id"])
        post["created_at"] = post["created_at"].isoformat()
        return post
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid post ID: {str(e)}")

@router.put("/{post_id}")
async def update_post(
    post_id: str, 
    post_update: PostUpdate, 
    user: str = Depends(get_current_user)
):
    """Update a post's content and/or tone"""
    try:
        # Check if post exists and belongs to user
        existing_post = await database.posts.find_one({
            "_id": ObjectId(post_id),
            "user_email": user
        })
        
        if not existing_post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Build update dict with only provided fields
        update_data = {}
        if post_update.content is not None:
            update_data["content"] = post_update.content
        if post_update.tone is not None:
            update_data["tone"] = post_update.tone
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_data["updated_at"] = datetime.utcnow()
        
        # Update the post
        await database.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": update_data}
        )
        
        # Fetch and return updated post
        updated_post = await database.posts.find_one({"_id": ObjectId(post_id)})
        updated_post["_id"] = str(updated_post["_id"])
        updated_post["created_at"] = updated_post["created_at"].isoformat()
        if "updated_at" in updated_post:
            updated_post["updated_at"] = updated_post["updated_at"].isoformat()
        
        return {"message": "Post updated successfully", "post": updated_post}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating post: {str(e)}")

@router.delete("/{post_id}")
async def delete_post(post_id: str, user: str = Depends(get_current_user)):
    """Delete a post by ID"""
    try:
        # Check if post exists and belongs to user
        existing_post = await database.posts.find_one({
            "_id": ObjectId(post_id),
            "user_email": user
        })
        
        if not existing_post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Delete the post
        await database.posts.delete_one({"_id": ObjectId(post_id)})
        
        return {"message": "Post deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting post: {str(e)}")

@router.post("/{post_id}/favorite")
async def toggle_favorite(post_id: str, user: str = Depends(get_current_user)):
    """Toggle favorite status for a post"""
    try:
        # Get the current post
        post = await database.posts.find_one({
            "_id": ObjectId(post_id),
            "user_email": user
        })
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Toggle the favorite status
        current_favorite = post.get("is_favorite", False)
        new_favorite = not current_favorite
        
        await database.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"is_favorite": new_favorite}}
        )
        
        return {
            "message": f"Post {'added to' if new_favorite else 'removed from'} favorites",
            "is_favorite": new_favorite
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error toggling favorite: {str(e)}")

