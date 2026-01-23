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