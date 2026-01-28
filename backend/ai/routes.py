from fastapi import APIRouter, Depends
from pydantic import BaseModel
from auth.dependencies import get_current_user
from ai.prompts import build_prompt
from ai.rate_limit import check_rate_limit
from ai.service import generate_linkedin_post
from db.mongodb import db

router = APIRouter(prefix = "/ai", tags = ["AI"])

class GenerateRequest(BaseModel):
    topic: str
    tone: str = "professional"
    hook: str = "question"
    cta: str = "comment"


@router.post("/generate")
async def generate_post(
    data: GenerateRequest,
    email: str = Depends(get_current_user)
):
    """
    Generate a LinkedIn post using AI based on user parameters.
    
    This endpoint uses Groq's Llama 3.1 model to generate
    high-quality LinkedIn posts tailored to the specified
    topic, tone, hook, and call-to-action.
    """
    try:
        # Check rate limiting
        await check_rate_limit(email)
        
        # Generate post using Groq API
        generated_content = await generate_linkedin_post(
            topic=data.topic,
            tone=data.tone,
            hook=data.hook,
            cta=data.cta
        )
        
        return {
            'generated_post': generated_content,
            'model': 'llama-3.3-70b-versatile',
            'parameters': {
                'tone': data.tone,
                'hook': data.hook,
                'cta': data.cta
            }
        }
    
    except Exception as e:
        # Return error with details
        from fastapi import HTTPException
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate post: {str(e)}"
        )

@router.get("/scheduled")
async def get_scheduled_posts(user: str = Depends(get_current_user)):
    posts = await db.scheduled_posts.find(
        {"user_email": user}
    ).sort("scheduled_time", 1).to_list(100)

    for p in posts:
        p["_id"] = str(p["_id"])
        p["scheduled_time"] = p["scheduled_time"].isoformat()

    return posts