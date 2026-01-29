from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.mongodb import database
from auth.routes import router as auth_router
from ai.routes import router as ai_router
from scheduler.worker import scheduler, process_scheduled_posts
from analytics.routes import router as analytics_router
from posts.routes import router as posts_router
from templates.routes import router as templates_router
from user_profile.routes import router as profile_router



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Vercel, localhost, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {"status": "Backend running"}

@app.get("/test-db")
async def test_db():
    collections = await database.list_collection_names()
    return {
        "status": "MongoDB connected",
        "collections": collections
    }


@app.on_event("startup")
async def start_scheduler():
    scheduler.add_job(process_scheduled_posts, "interval", minutes=1)
    scheduler.start()

app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(analytics_router)
app.include_router(posts_router)
app.include_router(templates_router)
app.include_router(profile_router)