from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user
from ai.prompts import build_prompt
from ai.rate_limit import check_rate_limit

router = APIRouter(prefix = "/ai", tags = ["AI"])

@router.post("/generate")
async def generate_post(
    topic: str,
    tone: str = "professional",
    hook: str = "question",
    cta: str = "comment",
    email: str = Depends(get_current_user)
):
    await check_rate_limit(email)

    system_prompt, user_prompt = build_prompt(topic, tone, hook, cta)
    
    return {
        'post': f"[MOCK AI OUTPUT]\n{user_prompt}"
    }