from pydantic import BaseModel
from typing import Optional

class PostCreate(BaseModel):
    content: str
    tone: str

class PostUpdate(BaseModel):
    content: Optional[str] = None
    tone: Optional[str] = None