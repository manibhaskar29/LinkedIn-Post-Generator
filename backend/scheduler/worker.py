from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime
from db.mongodb import database

scheduler = AsyncIOScheduler()

async def process_scheduled_posts():
    now = datetime.utcnow()

    posts = await database.scheduled_posts.find({
        "status": "scheduled",
        "scheduled_time": {"$lte": now}
    }).to_list(length=10)

    for post in posts:
        try:
            await database.scheduled_posts.update_one(
                {"_id": post["_id"]},
                {"$set": {"status": "running"}}
            )
            
            # Simulate posting (LinkedIn API Later)
            print("Posting: ", post["content"])
            
            await database.scheduled_posts.update_one(
                {"_id": post["_id"]},
                {"$set": {"status": "posted"}}
            )
        except Exception as e:
            await database.scheduled_posts.update_one(
                {"_id": post["_id"]},
                {
                    "$set": {
                        "status": "failed",
                        "last_error": str(e)
                    },
                    "$inc": {"retry_count": 1}
                }
            )