from groq import Groq
import os
from dotenv import load_dotenv
from ai.prompts import build_prompt

load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Model configuration
GROQ_MODEL = "llama-3.3-70b-versatile"  # Updated to current model
DEFAULT_TEMPERATURE = 0.7
MAX_TOKENS = 500


async def generate_linkedin_post(
    topic: str,
    tone: str = "professional",
    hook: str = "question",
    cta: str = "comment"
) -> str:
    """
    Generate a LinkedIn post using Groq's Llama model.
    
    Args:
        topic: The main topic/subject of the post
        tone: Tone of the post (professional, casual, inspiring)
        hook: Hook style (question, stat, story)
        cta: Call-to-action type (comment, share, connect)
    
    Returns:
        Generated LinkedIn post content as string
    
    Raises:
        Exception: If API call fails or returns invalid response
    """
    try:
        # Build prompts using existing prompt templates
        system_prompt, user_prompt = build_prompt(topic, tone, hook, cta)
        
        # Make synchronous call to Groq API
        # Note: Groq SDK doesn't have async support yet, but it's fast enough
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=DEFAULT_TEMPERATURE,
            max_tokens=MAX_TOKENS,
        )
        
        # Extract generated content
        generated_content = response.choices[0].message.content
        
        if not generated_content:
            raise ValueError("Generated content is empty")
        
        return generated_content.strip()
    
    except Exception as e:
        # Log error and raise
        print(f"Error generating LinkedIn post: {str(e)}")
        raise Exception(f"Failed to generate post: {str(e)}")


def test_groq_connection():
    """
    Test function to verify Groq API connection.
    Returns True if connection is successful, False otherwise.
    """
    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "user", "content": "Say 'Hello World' in one word"}
            ],
            max_tokens=10,
        )
        return True
    except Exception as e:
        print(f"Groq connection test failed: {str(e)}")
        return False
