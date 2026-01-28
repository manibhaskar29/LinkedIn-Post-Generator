from datetime import date
from fastapi import HTTPException
from db.mongodb import database

MAX_DAILY_POSTS = 5

async def check_rate_limit(email: str):
    today = str(date.today())
    # Use composite key: email_date as _id to avoid conflicts
    record_id = f"{email}_{today}"
    
    record = await database.ai_usage.find_one({"_id": record_id})
    if record and record["count"] >= MAX_DAILY_POSTS:
        raise HTTPException(status_code=429, detail="Daily limit exceeded")
   
    if record:
        await database.ai_usage.update_one({"_id": record_id}, {"$inc": {"count": 1}})
    else:
        await database.ai_usage.insert_one({
            "_id": record_id,
            "email": email,
            "date": today,
            "count": 1
        })
