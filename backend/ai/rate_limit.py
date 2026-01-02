from datetime import date
from fastapi import HTTPException
from db.mongodb import database

MAX_DAILT_POSTS = 5

async def check_rate_limit(email: str):
    today = str(date.today())

    record = await database.ai_usage.find_one({"email": email, "date": today})
    if record and record["count"] >= MAX_DAILT_POSTS:
        raise HTTPException(status_code=429, detail="Daily limit exceeded")
   
    if record:
        await database.ai_usage.update_one({"_id": record["_id"]}, {"$inc": {"count": 1}})
    else:
        await database.ai_usage.insert_one({"_id": email, "date": today, "count": 1})