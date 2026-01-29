from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TemplateCreate(BaseModel):
    """Schema for creating a new template"""
    name: str
    content: str
    tone: str
    description: Optional[str] = None


class TemplateResponse(BaseModel):
    """Schema for template response"""
    id: str
    name: str
    content: str
    tone: str
    description: Optional[str] = None
    user_email: str
    created_at: str
