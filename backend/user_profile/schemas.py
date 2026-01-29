from pydantic import BaseModel
from typing import Optional


class ProfileUpdate(BaseModel):
    """User profile update schema"""
    name: Optional[str] = None
    bio: Optional[str] = None


class PasswordChange(BaseModel):
    """Password change schema"""
    old_password: str
    new_password: str


class UserPreferences(BaseModel):
    """User preferences schema"""
    default_tone: Optional[str] = "professional"
    default_length: Optional[str] = "medium"
    notifications_enabled: Optional[bool] = True
    timezone: Optional[str] = "UTC"
