from fastapi import APIRouter, Depends
from pydantic import BaseModel
from auth.dependencies import get_current_user
from ai.prompts import build_prompt
from ai.rate_limit import check_rate_limit

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
    await check_rate_limit(email)

    system_prompt, user_prompt = build_prompt(
        data.topic,
        data.tone,
        data.hook,
        data.cta
    )
    
    return {
        'generated_post': f"[MOCK AI OUTPUT]\n{user_prompt}"
    }

@router.get("scheduled")
async def get_scheduled_posts(user: str = Depends(get_current_user)):
    posts = await db.scheduled_posts.find(
        {"user_email": user}
    ).sort("scheduled_time", 1).to_list(100)

    for p in posts:
        p["_id"] = str(p["_id"])
        p["scheduled_time"] = p["scheduled_time"].isoformat()

    return posts