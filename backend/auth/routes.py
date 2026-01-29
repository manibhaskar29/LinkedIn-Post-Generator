from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.mongodb import database
from auth.utils import hash_password, create_access_token, verify_password, create_refresh_token
from auth.dependencies import get_current_user
from auth.otp_store import generate_otp, store_otp, verify_otp, can_resend_otp
from utils.email_service import send_otp_email
from jose import JWTError, jwt
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"


# Request models
class SendOTPRequest(BaseModel):
    email: str
    password: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str
    password: str


@router.post("/register/send-otp")
async def send_registration_otp(request: SendOTPRequest):
    """Step 1: Send OTP to email for registration"""
    try:
        # Check if user already exists
        existing_user = await database.users.find_one({"email": request.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Validate password length
        if len(request.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

        # Check rate limiting
        can_send, message = can_resend_otp(request.email)
        if not can_send:
            raise HTTPException(status_code=429, detail=message)

        # Generate and store OTP
        otp = generate_otp()
        store_otp(request.email, otp)

        # Send OTP via email
        email_sent = send_otp_email(request.email, otp)

        if not email_sent:
            raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again.")

        return {
            "message": "OTP sent to your email",
            "email": request.email,
            "expires_in_minutes": 5
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending OTP: {str(e)}")


@router.post("/register/verify-otp")
async def verify_registration_otp(request: VerifyOTPRequest):
    """Step 2: Verify OTP and create account"""
    try:
        # Check if user already exists (double-check)
        existing_user = await database.users.find_one({"email": request.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Verify OTP
        is_valid, message = verify_otp(request.email, request.otp)

        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        # Create user account
        hashed_password = hash_password(request.password)
        new_user = {
            "email": request.email,
            "password": hashed_password,
            "email_verified": True
        }
        await database.users.insert_one(new_user)

        # Generate access token
        access_token = create_access_token(data={"email": request.email})

        return {
            "message": "Account created successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "email": request.email
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating account: {str(e)}")


@router.post("/signup")
async def signup(email: str, password: str):
    """Legacy registration endpoint (without OTP)"""
    user = await database.users.find_one({"email": email})
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = hash_password(password)
    new_user = {"email": email, "password": hashed_password}
    await database.users.insert_one(new_user)
    return {"message": "User created successfully"} 

@router.post("/login")
async def login(email: str, password: str):
    user = await database.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"email": email})
    return {"access_token": access_token, "token_type": "bearer"}
