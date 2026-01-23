# LinkedIn Post Generator

A web application for generating LinkedIn posts using AI, with features for scheduling, sentiment analysis, and post management.

## Project Structure

- **Backend**: FastAPI Python application (`main.py`)
- **Frontend**: HTML/CSS/JavaScript (`index.html`, `style.css`)
- **Dependencies**: Listed in `requirements.txt`

## Prerequisites

1. **Python 3.8+** installed on your system
2. **MySQL** database server installed and running
3. **Groq API Key** (get one from https://console.groq.com/)

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up MySQL Database

Make sure MySQL is running on your system. The application will automatically create the `scheduled_posts` database and `posts` table when you first run it.

Default MySQL configuration:
- Host: `localhost`
- User: `root`
- Database: `scheduled_posts`

### 3. Configure Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
# Groq API Key (required)
GROQ_API_KEY=your_groq_api_key_here

# MySQL Configuration (optional - defaults shown)
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_DATABASE=scheduled_posts

# For Render deployment (optional)
IS_RENDER=false
```

**Note**: Replace `your_groq_api_key_here` with your actual Groq API key and `your_mysql_password` with your MySQL root password.

### 4. Run the Application

Since FastAPI serves the frontend automatically, you only need to run the backend:

```bash


cd backend
python -m venv venv
.\venv\Scripts\activate

# Using uvicorn (recommended)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python main.py
```

The application will be available at:
- **Frontend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (FastAPI auto-generated docs)

## Running the Application

### Option 1: Using uvicorn (Recommended)

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The `--reload` flag enables auto-reload on code changes (useful for development).

### Option 2: Using Python directly

```bash
python main.py
```

**Note**: The current `main.py` uses `loop.run_forever()` which may not work well with uvicorn. For production, consider using uvicorn instead.

## Accessing the Application

Once running, open your browser and navigate to:
- **Main Application**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## Features

- Generate LinkedIn posts using AI (Groq API)
- Customize tone, length, and industry
- Schedule posts for future publishing
- Sentiment analysis
- Post history and export
- Dark mode support
- Rich text editing with Quill.js

## Troubleshooting

### MySQL Connection Issues

If you encounter MySQL connection errors:
1. Ensure MySQL server is running
2. Verify your MySQL password in the `.env` file
3. Check that MySQL allows connections from localhost

### API Key Issues

If you get "GROK_API_KEY not found" error:
1. Create a `.env` file in the project root
2. Add `GROQ_API_KEY=your_actual_api_key`
3. Restart the application

### Port Already in Use

If port 8000 is already in use:
```bash
# Use a different port
uvicorn main:app --reload --port 8001
```

Then update the frontend API calls in `index.html` to use `http://127.0.0.1:8001` instead of `http://127.0.0.1:8000`.

## Development Notes

- The frontend makes API calls to `http://127.0.0.1:8000` - update this if you change the port
- CORS is enabled for all origins (configure in `main.py` for production)
- The application uses APScheduler for post scheduling
- Sentiment analysis uses VADER sentiment analyzer
