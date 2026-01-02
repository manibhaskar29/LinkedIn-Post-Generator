from fastapi import FastAPI
from db.mongodb import database
from auth.routes import router as auth_router

app = FastAPI()

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

app.include_router(auth_router)



