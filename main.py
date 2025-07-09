from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import requests
import json
import os
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from datetime import datetime
import mysql.connector
from mysql.connector import Error
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from zoneinfo import ZoneInfo

load_dotenv()

app = FastAPI()

# Serve index.html from root
@app.get("/", response_class=FileResponse)
async def read_index():
    return FileResponse("index.html")

# Mount static files under /static
app.mount("/static", StaticFiles(directory="."), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize APScheduler
scheduler = AsyncIOScheduler()
scheduler.add_jobstore(SQLAlchemyJobStore(url=f'mysql+mysqlconnector://root:{os.getenv("MYSQL_PASSWORD")}@localhost/scheduled_posts'), 'default')
scheduler.start()

url = "https://api.groq.com/openai/v1/chat/completions"
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise HTTPException(status_code=500, detail="GROK_API_KEY not found in environment variables")

industry_hashtags = {
    "tech": ["#Technology", "#Innovation", "#TechTrends", "#DigitalTransformation", "#AI"],
    "healthcare": ["#Healthcare", "#MedicalInnovation", "#HealthTech", "#PatientCare", "#Wellness"],
    "finance": ["#Finance", "#FinTech", "#Investing", "#FinancialPlanning", "#WealthManagement"],
    "general": ["#Career", "#Leadership", "#ProfessionalDevelopment", "#Networking", "#Motivation"]
}

async def post_to_linkedin(post: str, job_id: str):
    try:
        # Placeholder: Replace with actual LinkedIn API call
        linkedin_url = "https://api.linkedin.com/v2/ugcPosts"
        headers = {
            "Authorization": f"Bearer {os.getenv('LINKEDIN_ACCESS_TOKEN')}",
            "Content-Type": "application/json"
        }
        payload = {
            "author": "urn:li:person:your_person_urn",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {"text": post},
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
        }
        response = requests.post(linkedin_url, headers=headers, json=payload)
        response.raise_for_status()
        
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=os.getenv("MYSQL_PASSWORD"),
            database="scheduled_posts"
        )
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE posts SET status = %s WHERE job_id = %s",
            ("posted", job_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Posted to LinkedIn: {post}")
    except Exception as e:
        print(f"Error posting to LinkedIn: {e}")
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=os.getenv("MYSQL_PASSWORD"),
            database="scheduled_posts"
        )
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE posts SET status = %s WHERE job_id = %s",
            ("failed", job_id)
        )
        conn.commit()
        cursor.close()
        conn.close()

def validate_schedule_time(schedule_time: str) -> bool:
    try:
        datetime.fromisoformat(schedule_time.replace('Z', '+00:00'))
        return True
    except ValueError:
        return False

@app.post("/schedulePost")
async def schedulePost(request: Request):
    try:
        res = await request.json()
        post = res.get("post", "")
        schedule_time = res.get("scheduleTime", "")
        
        if not post or not validate_schedule_time(schedule_time):
            raise HTTPException(status_code=400, detail="Post content and valid schedule time are required")

        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=os.getenv("MYSQL_PASSWORD"),
            database="scheduled_posts"
        )
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post TEXT,
                schedule_time VARCHAR(255),
                job_id VARCHAR(255),
                status VARCHAR(50)
            )
        """)
        
        job_id = f"post_{schedule_time}_{hash(post)}"
        cursor.execute(
            "INSERT INTO posts (post, schedule_time, job_id, status) VALUES (%s, %s, %s, %s)",
            (post, schedule_time, job_id, "scheduled")
        )
        conn.commit()
        
        # Schedule post with APScheduler
        schedule_dt = datetime.fromisoformat(schedule_time.replace('Z', '+00:00')).astimezone(ZoneInfo("UTC"))
        scheduler.add_job(
            post_to_linkedin,
            'date',
            run_date=schedule_dt,
            args=[post, job_id],
            id=job_id,
            jobstore='default'
        )
        
        cursor.close()
        conn.close()
        return {"status": "Post scheduled successfully", "job_id": job_id}
    except Error as e:
        print(f"MySQL Error: {e}")
        raise HTTPException(status_code=500, detail=f"MySQL Error: {str(e)}")
    except Exception as e:
        print(f"Error scheduling post: {e}")
        raise HTTPException(status_code=500, detail=f"Error scheduling post: {str(e)}")

@app.get("/getScheduledPosts")
async def get_scheduled_posts(status: str = None):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=os.getenv("MYSQL_PASSWORD"),
            database="scheduled_posts"
        )
        cursor = conn.cursor(dictionary=True)
        if status:
            cursor.execute("SELECT * FROM posts WHERE status = %s", (status,))
        else:
            cursor.execute("SELECT * FROM posts")
        posts = cursor.fetchall()
        cursor.close()
        conn.close()
        return [{"id": post["id"], "post": post["post"], "schedule_time": post["schedule_time"], 
                 "job_id": post["job_id"], "status": post["status"]} for post in posts]
    except Error as e:
        print(f"MySQL Error: {e}")
        raise HTTPException(status_code=500, detail=f"MySQL Error: {str(e)}")
    except Exception as e:
        print(f"Error fetching scheduled posts: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching scheduled posts: {str(e)}")

@app.post("/generatePost")
async def generatePost(request: Request):
    try:
        res = await request.json()
        topic = res.get("topic", "").strip()
        description = res.get("description", "").strip()
        tone = res.get("tone", "professional")
        length = res.get("length", "medium")
        industry = res.get("industry", "general")
        structure = res.get("structure", {"intro": True, "body": True, "cta": True})

        if not topic or len(topic) < 3:
            raise HTTPException(status_code=400, detail="Topic must be at least 3 characters long")

        length_guidance = {
            "short": "50-100 words",
            "medium": "100-200 words",
            "long": "200+ words"
        }
        prompt = f"Generate a {tone} LinkedIn post about {topic} for the {industry} industry, approximately {length_guidance[length]}. "
        if structure["intro"]:
            prompt += "Start with a brief introduction. "
        if structure["body"]:
            prompt += "Include detailed main content. "
        if structure["cta"]:
            prompt += "End with a call-to-action (e.g., ask a question or invite comments). "
        if description:
            prompt += f"Follow these specific instructions: {description}. "
        prompt += "Include 3-5 relevant hashtags at the end, prefixed with 'Hashtags:'."

        payload = json.dumps({
            "messages": [
                {"role": "system", "content": "You are a helpful assistant specializing in creating engaging LinkedIn posts."},
                {"role": "user", "content": prompt}
            ],
            "model": "llama-3.3-70b-versatile"
        })
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        data = response.json()
        content = data['choices'][0]['message']['content']

        post, hashtags = content.split("Hashtags:", 1) if "Hashtags:" in content else (content, "")
        
        if not hashtags.strip():
            hashtags = ", ".join(industry_hashtags.get(industry, industry_hashtags["general"]))

        engagement_score = 5
        if structure["cta"]:
            engagement_score += 2
        if len(hashtags.split(",")) >= 3:
            engagement_score += 1
        if tone == "inspirational":
            engagement_score += 1
        engagement_score = min(engagement_score, 10)

        return {
            "post": post.strip(),
            "hashtags": hashtags.strip(),
            "engagementScore": engagement_score
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating post: {str(e)}")

@app.get("/suggestTopics")
async def suggestTopics(industry: str = "general"):
    try:
        topics = {
            "tech": ["AI advancements", "Cloud computing trends", "Cybersecurity challenges", "Tech startup growth"],
            "healthcare": ["Telemedicine innovations", "Patient care improvements", "Healthcare technology", "Mental health awareness"],
            "finance": ["FinTech disruptions", "Investment strategies", "Financial literacy", "Blockchain in finance"],
            "general": ["Career growth tips", "Leadership lessons", "Work-life balance", "Professional networking"]
        }
        return topics.get(industry, topics["general"])
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching topic suggestions")

@app.post("/analyzeSentiment")
async def analyzeSentiment(request: Request):
    try:
        res = await request.json()
        text = res.get("text", "")
        analyzer = SentimentIntensityAnalyzer()
        sentiment_scores = analyzer.polarity_scores(text)
        compound_score = sentiment_scores['compound']
        if compound_score >= 0.05:
            sentiment = "positive"
        elif compound_score <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        tone_mapping = {
            "professional": ["neutral", "positive"],
            "casual": ["neutral", "positive"],
            "inspirational": ["positive"]
        }
        user_tone = res.get("tone", "professional")
        is_tone_match = sentiment in tone_mapping.get(user_tone, ["neutral", "positive"])

        return {
            "sentiment": sentiment,
            "score": compound_score,
            "magnitude": sentiment_scores['pos'] + sentiment_scores['neg'],
            "is_tone_match": is_tone_match
        }
    except Exception as e:
        print(f"Error analyzing sentiment: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}")

@app.post("/generateImage")
async def generateImage(request: Request):
    try:
        res = await request.json()
        prompt = res.get("prompt", "")
        return {"imageUrl": "https://example.com/placeholder-image.jpg"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error generating image")

@app.post("/submitFeedback")
async def submitFeedback(request: Request):
    try:
        res = await request.json()
        rating = res.get("rating", "")
        feedback = res.get("feedback", "")
        post = res.get("post", "")
        return {"status": "Feedback submitted successfully"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error submitting feedback")