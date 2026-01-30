# 🔧 LinkedIn Post Generator - Backend API

> FastAPI-based REST API with AI integration, authentication, and background job scheduling

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq_AI-FF6F00?style=flat-square&logo=ai&logoColor=white)](https://groq.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Running the Application](#running-the-application)
- [Testing](#testing)

---

## 🎯 Overview

The backend is a RESTful API built with **FastAPI**, providing authentication, AI-powered post generation using **Groq's Llama 3.3 model**, post management, scheduling, analytics, and email services. It uses **MongoDB** for data persistence and employs industry-standard security practices.

### Key Capabilities
- ✅ **AI Integration:** Groq Llama 3.3 70B for intelligent post generation
- ✅ **Secure Authentication:** JWT tokens with bcrypt password hashing
- ✅ **Email Verification:** OTP-based registration via SMTP
- ✅ **Background Jobs:** APScheduler for automated post scheduling
- ✅ **Rate Limiting:** Prevent API abuse with intelligent rate limiting
- ✅ **Async Operations:** Non-blocking I/O with Motor (async MongoDB driver)
- ✅ **Interactive Docs:** Auto-generated Swagger UI at `/docs`

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT Token Authentication:** Secure access and refresh token system
- **Password Hashing:** Bcrypt encryption for user passwords
- **Email OTP Verification:** Two-factor authentication for new user registration
- **Protected Endpoints:** Middleware-based route protection
- **CORS Configuration:** Secure cross-origin resource sharing

### 🤖 AI Post Generation
- **Groq API Integration:** Access to Llama 3.3 70B model
- **Customizable Parameters:** Tone, hook style, call-to-action
- **Prompt Engineering:** Optimized prompts for LinkedIn content
- **Rate Limiting:** User-based rate limits to prevent abuse
- **Error Handling:** Graceful fallback and error messages

### 📝 Post Management (CRUD)
- **Create Posts:** Save AI-generated or manual content
- **Read Posts:** Retrieve all posts or single post by ID
- **Update Posts:** Edit existing post content and metadata
- **Delete Posts:** Remove posts from database
- **Advanced Search:** Full-text search with filters
- **Favorites:** Mark and organize favorite posts
- **Engagement Tracking:** Store and retrieve engagement scores

### 📅 Scheduler & Background Jobs
- **APScheduler Integration:** Background task processing
- **Post Scheduling:** Schedule posts for future publication
- **Retry Mechanism:** Automatic retry for failed posts
- **Status Tracking:** Monitor scheduled, published, and failed posts

### 📧 Email Service
- **SMTP Integration:** Gmail-based email sending
- **HTML Templates:** Beautifully formatted OTP emails
- **Rate Limiting:** Prevent email spam with cooldown periods

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | Latest | Modern Python web framework |
| **Python** | 3.11+ | Programming language |
| **Motor** | Latest | Async MongoDB driver |
| **MongoDB** | Atlas | NoSQL database |
| **Groq SDK** | Latest | AI model API client |
| **Python-Jose** | Latest  | JWT token handling |
| **Passlib** | Latest | Password hashing |
| **Bcrypt** | 4.0.1 | Encryption algorithm |
| **APScheduler** | Latest | Background job scheduler |
| **Pydantic** | Latest | Data validation |
| **SMTP** | Built-in | Email service |
| **VaderSentiment** | Latest | Sentiment analysis |
| **Uvicorn** | Latest | ASGI server |

---

## 📂 Project Structure

```
backend/
├── ai/                          # AI service module
│   ├── service.py              # Groq API integration
│   ├── prompts.py              # Prompt templates
│   ├── rate_limit.py           # Rate limiting logic
│   └── routes.py               # AI generation endpoints
│
├── analytics/                   # Analytics module
│   ├── routes.py               # Analytics endpoints
│   └── schemas.py              # Pydantic models
│
├── auth/                        # Authentication module
│   ├── routes.py               # Auth endpoints
│   ├── utils.py                # JWT & password utilities
│   ├── dependencies.py         # Auth middleware
│   ├── models.py               # User models
│   └── otp_store.py            # OTP management
│
├── db/                          # Database configuration
│   └── mongodb.py              # MongoDB connection
│
├── posts/                       # Posts management
│   ├── routes.py               # CRUD endpoints
│   └── schemas.py              # Post models
│
├── scheduler/                   # Background scheduler
│   └── worker.py               # APScheduler worker
│
├── templates/                   # Post templates
│   ├── routes.py               # Template endpoints
│   └── schemas.py              # Template models
│
├── user_profile/                # User profile
│   ├── routes.py               # Profile endpoints
│   └── schemas.py              # Profile models
│
├── utils/                       # Shared utilities
│   └── email_service.py        # SMTP email service
│
├── main.py                      # Application entry point
├── requirements.txt             # Python dependencies
├── .env.example                # Environment template
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites
- Python 3.11 or higher
- MongoDB Atlas account
- Groq API key
- Gmail account with App Password

### Steps

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin_post_generator_db?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_ALGORITHM=HS256

# Groq AI API
GROQ_API_KEY=gsk_yourgroquapikey

# Email/SMTP Configuration (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
```

### How to Get Credentials:

**MongoDB URI:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string from "Connect" button

**Groq API Key:**
1. Sign up at [Groq Console](https://console.groq.com/)
2. Navigate to API Keys section
3. Generate new API key

**Gmail App Password:**
1. Enable 2-Step Verification on Google Account
2. Go to Security → App passwords
3. Generate password for "Mail"
4. Use the 16-character password (remove spaces)

---

## 📡 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register/send-otp` | Send OTP to email for registration | ❌ |
| POST | `/auth/register/verify-otp` | Verify OTP and create account | ❌ |
| POST | `/auth/login` | User login with email/password | ❌ |
| POST | `/auth/signup` | Legacy signup (no OTP) | ❌ |

### AI Generation (`/ai`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/generate` |  Generate LinkedIn post with AI | ✅ |
| GET | `/ai/scheduled` | Get user's scheduled posts | ✅ |

### Posts (`/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/posts/create` | Create new post | ✅ |
| GET | `/posts/all` | Get all posts (with filters) | ✅ |
| GET | `/posts/{post_id}` | Get single post | ✅ |
| PUT | `/posts/{post_id}` | Update post | ✅ |
| DELETE | `/posts/{post_id}` | Delete post | ✅ |
| POST | `/posts/{post_id}/favorite` | Toggle favorite status | ✅ |
| POST | `/posts/schedule` | Schedule a post | ✅ |

### Templates (`/templates`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/templates/all` | Get all templates | ✅ |
| POST | `/templates/create` | Create template | ✅ |
| GET | `/templates/{template_id}` | Get template by ID | ✅ |

### Analytics (`/analytics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/overview` | Get analytics overview | ✅ |
| GET | `/analytics/trends` | Get performance trends | ✅ |

### User Profile (`/profile`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/me` | Get current user profile | ✅ |
| PUT | `/profile/update` | Update user profile | ✅ |

---

## 🗄️ Database Schema

### Collections

**users**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  email_verified: Boolean,
  created_at: DateTime
}
```

**posts**
```javascript
{
  _id: ObjectId,
  user_email: String,
  content: String,
  tone: String,
  engagement_score: Float,
  is_favorite: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

**scheduled_posts**
```javascript
{
  _id: ObjectId,
  user_email: String,
  content: String,
  scheduled_time: DateTime,
  status: String,  // scheduled | published | failed
  retry_count: Integer,
  last_error: String,
  created_at: DateTime
}
```

**templates**
```javascript
{
  _id: ObjectId,
  user_email: String,
  name: String,
  content: String,
  category: String,
  created_at: DateTime
}
```

---

## ▶️ Running the Application

### Development Server

```bash
uvicorn main:app --reload --port 8000
```

### Production Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Access Points
- **API Base URL:** http://localhost:8000
- **Interactive Docs (Swagger UI):** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/ (returns status)
- **Database Test:** http://localhost:8000/test-db

---

## 🧪 Testing

### Manual Testing with Swagger UI

1. Start the server
2. Navigate to http://localhost:8000/docs
3. Try out endpoints interactively
4. Test authentication flow
5. Generate posts with AI

### Testing Email Service

```python
from utils.email_service import send_otp_email

# Send test email
send_otp_email("recipient@example.com", "123456")
```

### Testing Database Connection

```bash
curl http://localhost:8000/test-db
```

---

## 🔧 Configuration

### CORS Settings

Located in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

### Rate Limiting

Configure in `ai/rate_limit.py`:
- Default: 10 requests per hour per user
- Adjustable per endpoint

### Scheduler Configuration

Located in `scheduler/worker.py`:
- Runs every 1 minute
- Processes scheduled posts
- Max 3 retries for failed posts

---

## 📦 Dependencies

See [requirements.txt](requirements.txt) for full list. Key dependencies:

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `motor` - Async MongoDB driver
- `groq` - Groq AI SDK
- `python-jose[cryptography]` - JWT handling
- `passlib[bcrypt]` - Password hashing
- `apscheduler` - Background jobs
- `pydantic` - Data validation
- `python-dotenv` - Environment variables

---

## 🚀 Deployment

For production deployment on Render:

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env`
6. Deploy!

See [Deployment Guide](../deployment_env_guide.md) for detailed instructions.

---

## 📝 License

This project is part of the LinkedIn Post Generator application.

---

## 👨‍💻 Developer

**Kenguva Manibhaskar**
- Email: kenguva.manibhaskar@gmail.com
- GitHub: [@manibhaskar29](https://github.com/manibhaskar29)

---

<p align="center">Part of the <a href="../README.md">LinkedIn Post Generator</a> project</p>
