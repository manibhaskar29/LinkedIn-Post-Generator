# 🚀 LinkedIn Post Generator

## 🎯 Project Overview

The **LinkedIn Post Generator** is a modern, full-stack SaaS application designed to streamline content creation for LinkedIn professionals. Built with cutting-edge technologies and powered by Groq's Llama 3.3 AI model, this application offers intelligent post generation, comprehensive content management, performance analytics, and scheduling capabilities.

### 💼 Business Value
- **Saves Time:** Generate professional LinkedIn posts in seconds instead of hours
- **Increases Engagement:** AI-optimized content tailored to your audience
- **Boosts Productivity:** Manage all your LinkedIn content in one centralized platform
- **Data-Driven:** Track performance metrics to improve content strategy

---

## ✨ Key Features

### 🤖 AI-Powered Post Generation
- **Groq Llama 3.3 Integration:** Leverage state-of-the-art large language model for high-quality content
- **Customizable Parameters:**
  - **Tone Selection:** Professional, Casual, Inspiring
  - **Hook Styles:** Question, Statistic, Story
  - **Call-to-Action:** Comment, Share, Connect
- **Real-time Preview:** See your post before saving
- **Pre-built Templates:** Quick-start templates for common post types

### 📝 Content Management
- **CRUD Operations:** Create, Read, Update, Delete posts with ease
- **Advanced Filtering & Search:**
  - Search by keywords in content
  - Filter by tone, date range, engagement score
  - Sort by creation date, engagement, favorites
- **Favorites System:** Mark and organize your best-performing posts
- **Post Analytics:** Track engagement scores for each post

### 📅 Scheduling & Automation
- **Post Scheduler:** Schedule posts for optimal publishing times
- **Background Worker:** Automated APScheduler processes scheduled posts
- **Retry Mechanism:** Automatic retry for failed post publishing
- **Status Tracking:** Monitor scheduled, published, and failed posts

### 📊 Analytics Dashboard
- **Performance Metrics:** View aggregated statistics and trends
- **Engagement Tracking:** Monitor post performance over time
- **Data Visualization:** Interactive charts and graphs using Recharts

### 🔐 Security & Authentication
- **JWT-Based Authentication:** Secure token-based auth system
- **Email OTP Verification:** Two-factor signup process with email verification
- **Password Hashing:** Industry-standard bcrypt password encryption
- **Protected Routes:** Role-based access control for frontend pages
- **CORS Configuration:** Secure cross-origin resource sharing

### 👤 User Profile Management
- **Profile Customization:** Update user information and preferences
- **Session Management:** Persistent login with refresh tokens
- **Activity Tracking:** Monitor user actions and history

---

## 🛠️ Technology Stack

### Backend (FastAPI)
| Technology | Purpose | Version |
|------------|---------|---------|
| **FastAPI** | Modern Python web framework | Latest |
| **Motor** | Async MongoDB driver | Latest |
| **Groq SDK** | AI model integration | Latest |
| **Python-Jose** | JWT token handling | Latest |
| **Passlib** | Password hashing (bcrypt) | Latest |
| **APScheduler** | Background job scheduling | Latest |
| **Pydantic** | Data validation | Latest |
| **SMTP** | Email service integration | Built-in |

### Frontend (React)
| Technology | Purpose | Version |
|------------|---------|---------|
| **React 19** | UI library | 19.2.0 |
| **Vite** | Build tool & dev server | 7.2.4 |
| **React Router** | Client-side routing | 7.13.0 |
| **Framer Motion** | Animations | 12.29.2 |
| **Recharts** | Data visualization | 3.7.0 |
| **Lucide React** | Icon library | 0.563.0 |
| **React Hot Toast** | Notifications | 2.6.0 |
| **TailwindCSS** | Utility-first CSS | 3.4.17 |

### Database
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | Cloud NoSQL database |
| **Collections:** | `users`, `posts`, `scheduled_posts`, `templates`, `analytics` |

### AI & ML
| Technology | Purpose |
|------------|---------|
| **Groq AI** | LLM API for post generation |
| **Llama 3.3 70B** | Large language model |
| **VaderSentiment** | Sentiment analysis |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Render** | Backend hosting |
| **Vercel** | Frontend hosting |
| **GitHub** | Version control |
| **Environment Variables** | Secure credential management |

---

## 📂 Project Structure

```
LinkedIn-Post-Generator/
├── backend/                      # FastAPI backend application
│   ├── ai/                      # AI service & Groq integration
│   │   ├── service.py          # Groq API client & post generation
│   │   ├── prompts.py          # Prompt engineering
│   │   ├── rate_limit.py       # Rate limiting logic
│   │   └── routes.py           # AI endpoint routes
│   ├── analytics/              # Analytics module
│   │   ├── routes.py          # Analytics API endpoints
│   │   └── schemas.py         # Pydantic models
│   ├── auth/                   # Authentication & authorization
│   │   ├── routes.py          # Auth endpoints (login, signup, OTP)
│   │   ├── utils.py           # JWT & password utilities
│   │   ├── dependencies.py    # Auth middleware
│   │   ├── models.py          # User models
│   │   └── otp_store.py       # OTP generation & validation
│   ├── db/                     # Database configuration
│   │   └── mongodb.py         # MongoDB connection
│   ├── posts/                  # Posts management
│   │   ├── routes.py          # CRUD endpoints
│   │   └── schemas.py         # Post models
│   ├── scheduler/              # Background job scheduler
│   │   └── worker.py          # APScheduler worker
│   ├── templates/              # Post templates
│   │   ├── routes.py          # Template endpoints
│   │   └── schemas.py         # Template models
│   ├── user_profile/           # User profile management
│   │   ├── routes.py          # Profile endpoints
│   │   └── schemas.py         # Profile models
│   ├── utils/                  # Shared utilities
│   │   └── email_service.py   # SMTP email service
│   ├── main.py                # Application entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variables template
│
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── api/               # API client configuration
│   │   ├── auth/              # Authentication context & utilities
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   ├── pages/             # Application pages
│   │   │   ├── Login.jsx     # Login page
│   │   │   ├── Signup.jsx    # Registration page
│   │   │   ├── Dashboard.jsx # Main dashboard
│   │   │   ├── GeneratePost.jsx # AI post generator
│   │   │   ├── Posts.jsx     # Posts library
│   │   │   ├── Templates.jsx # Template management
│   │   │   ├── Analytics.jsx # Analytics dashboard
│   │   │   ├── ScheduledPosts.jsx # Scheduled posts
│   │   │   ├── Profile.jsx   # User profile
│   │   │   └── Home.jsx      # Landing page
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx           # Main App component
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global styles
│   ├── public/                # Static assets
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   └── .env.example          # Environment variables template
│
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Groq API Key** - [Get API key](https://console.groq.com/)
- **Gmail Account** with App Password - For OTP emails

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/LinkedIn-Post-Generator.git
cd LinkedIn-Post-Generator
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env and add your credentials
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - JWT_ALGORITHM
# - GROQ_API_KEY
# - SMTP credentials (Gmail)
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add backend URL
# VITE_API_URL=http://localhost:8000
```

#### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256

# Groq AI API
GROQ_API_KEY=your-groq-api-key-here

# Email/SMTP Configuration (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
```

### Frontend (`frontend/.env`)

```env
# Backend API URL
VITE_API_URL=http://localhost:8000
```

> [!IMPORTANT]
> For production deployment on Render/Vercel, see [Deployment Guide](file:///C:/Users/Kenguva%20Manibhaskar/.gemini/antigravity/brain/1fbbd8a1-69e2-4f32-a2f3-547cdf226175/deployment_env_guide.md)

---

## 📡 API Documentation

The backend provides a RESTful API with the following main endpoints:

### Authentication
- `POST /auth/register/send-otp` - Send OTP for registration
- `POST /auth/register/verify-otp` - Verify OTP and create account
- `POST /auth/login` - User login
- `POST /auth/signup` - Legacy signup (without OTP)

### AI Generation
- `POST /ai/generate` - Generate LinkedIn post with AI
- `GET /ai/scheduled` - Get scheduled posts

### Posts Management
- `POST /posts/create` - Create a new post
- `GET /posts/all` - Get all posts with filtering & search
- `GET /posts/{post_id}` - Get single post by ID
- `PUT /posts/{post_id}` - Update post
- `DELETE /posts/{post_id}` - Delete post
- `POST /posts/{post_id}/favorite` - Toggle favorite status
- `POST /posts/schedule` - Schedule a post

### Templates
- `GET /templates/all` - Get all templates
- `POST /templates/create` - Create template
- `GET /templates/{template_id}` - Get template by ID

### Analytics
- `GET /analytics/overview` - Get analytics overview
- `GET /analytics/trends` - Get performance trends

### User Profile
- `GET /profile/me` - Get current user profile
- `PUT /profile/update` - Update user profile

**Interactive API Documentation:** Access Swagger UI at `/docs` when running the backend.

---

## 🏗️ Architecture & Design Patterns

### Backend Architecture
- **Clean Architecture:** Separation of concerns with distinct modules
- **Dependency Injection:** Using FastAPI's `Depends` system
- **Async/Await:** Non-blocking I/O operations with Motor
- **Repository Pattern:** Database abstraction layer
- **Middleware:** CORS, authentication, rate limiting

### Frontend Architecture
- **Component-Based:** Modular React components
- **Context API:** Global state management for auth & user data
- **Protected Routes:** Client-side route guards
- **Service Layer:** Centralized API communication
- **Responsive Design:** Mobile-first approach with Tailwind

### Database Schema
```
users
├── _id (ObjectId)
├── email (string, unique)
├── password (hashed string)
├── email_verified (boolean)
└── created_at (datetime)

posts
├── _id (ObjectId)
├── user_email (string)
├── content (string)
├── tone (string)
├── engagement_score (float)
├── is_favorite (boolean)
├── created_at (datetime)
└── updated_at (datetime)

scheduled_posts
├── _id (ObjectId)
├── user_email (string)
├── content (string)
├── scheduled_time (datetime)
├── status (string: scheduled/published/failed)
├── retry_count (int)
└── last_error (string, nullable)
```

---

## 🎓 Technical Skills Demonstrated

This project showcases proficiency in:

### Full-Stack Development
✅ RESTful API design and development  
✅ Modern frontend frameworks (React 19)  
✅ Backend frameworks (FastAPI)  
✅ Database design and management (MongoDB)  

### AI/ML Integration
✅ Large Language Model (LLM) integration  
✅ Prompt engineering  
✅ AI API consumption (Groq)  
✅ Sentiment analysis  

### Security & Authentication
✅ JWT token-based authentication  
✅ Password hashing and encryption  
✅ Email OTP verification (2FA)  
✅ CORS configuration  
✅ Environment variable management  

### DevOps & Deployment
✅ Cloud deployment (Render, Vercel)  
✅ CI/CD best practices  
✅ Environment configuration  
✅ Version control (Git)  

### Software Engineering Best Practices
✅ Clean code architecture  
✅ Modular design patterns  
✅ Error handling and logging  
✅ API documentation  
✅ Code organization and structure  

### Background Processing
✅ Job scheduling (APScheduler)  
✅ Asynchronous task handling  
✅ Retry mechanisms  

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Author

**Kenguva Manibhaskar**

- GitHub: [@manibhaskar29](https://github.com/manibhaskar29)
- LinkedIn: [linkedin.com/in/manibhaskar29](https://linkedin.com/in/manibhaskar29)
- Email: kenguva.manibhaskar@gmail.com

---

## 📝 Additional Resources

- [Backend API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Deployment Guide](file:///C:/Users/Kenguva%20Manibhaskar/.gemini/antigravity/brain/1fbbd8a1-69e2-4f32-a2f3-547cdf226175/deployment_env_guide.md)
- [Groq API Documentation](https://console.groq.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

---

## ⭐ Show Your Support

If you found this project helpful or interesting, please consider giving it a star! It helps others discover this project.

---

<p align="center">Made with ❤️ by Kenguva Manibhaskar</p>
