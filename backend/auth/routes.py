from fastapi import APIRouter, HTTPException
from db.mongodb import database
from auth.utils import hash_password, create_access_token, verify_password, create_refresh_token
from auth.dependencies import get_current_user
from db.mongodb import database
from jose import JWTError, jwt
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

@router.post("/signup")
async def signup(email: str, password: str):
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
