from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
from db.mongodb import database
from user_profile.schemas import ProfileUpdate, PasswordChange, UserPreferences
from passlib.context import CryptContext

router = APIRouter(prefix="/profile", tags=["Profile"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("")
async def get_profile(user_email: str = Depends(get_current_user)):
    """Get user profile"""
    user = await database.users.find_one({"email": user_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "email": user["email"],
        "name": user.get("name", ""),
        "bio": user.get("bio", ""),
        "created_at": user.get("created_at", "").isoformat() if user.get("created_at") else ""
    }


@router.put("")
async def update_profile(
    profile_data: ProfileUpdate,
    user_email: str = Depends(get_current_user)
):
    """Update user profile"""
    update_fields = {}
    if profile_data.name is not None:
        update_fields["name"] = profile_data.name
    if profile_data.bio is not None:
        update_fields["bio"] = profile_data.bio
    
    if update_fields:
        await database.users.update_one(
            {"email": user_email},
            {"$set": update_fields}
        )
    
    return {"message": "Profile updated successfully"}


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    user_email: str = Depends(get_current_user)
):
    """Change user password"""
    user = await database.users.find_one({"email": user_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify old password
    if not pwd_context.verify(password_data.old_password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    # Hash and update new password
    hashed_password = pwd_context.hash(password_data.new_password)
    await database.users.update_one(
        {"email": user_email},
        {"$set": {"password": hashed_password}}
    )
   
    return {"message": "Password changed successfully"}


@router.get("/preferences")
async def get_preferences(user_email: str = Depends(get_current_user)):
    """Get user preferences"""
    prefs = await database.user_preferences.find_one({"user_email": user_email})
    
    if not prefs:
        # Return defaults
        return {
            "default_tone": "professional",
            "default_length": "medium",
            "notifications_enabled": True,
            "timezone": "UTC"
        }
    
    return {
        "default_tone": prefs.get("default_tone", "professional"),
        "default_length": prefs.get("default_length", "medium"),
        "notifications_enabled": prefs.get("notifications_enabled", True),
        "timezone": prefs.get("timezone", "UTC")
    }


@router.put("/preferences")
async def update_preferences(
    preferences: UserPreferences,
    user_email: str = Depends(get_current_user)
):
    """Update user preferences"""
    await database.user_preferences.update_one(
        {"user_email": user_email},
        {"$set": preferences.dict(exclude_none=True)},
        upsert=True
    )
    
    return {"message": "Preferences updated successfully"}
