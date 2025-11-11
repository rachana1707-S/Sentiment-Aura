#This is a FastAPI backend for sentiment analysis.
#Our text → Backend validates → Groq AI analyzes → Returns JSON with sentiment

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import json
from typing import List, Optional
from groq import Groq # type: ignore

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Sentiment Aura API",
    description="Backend for real-time sentiment analysis and keyword extraction using Groq",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
# Text Response is what we send  that is just the text.
class TextRequest(BaseModel):
    text: str

# SentimentResponse is what we get back from the LLM. 
class SentimentResponse(BaseModel):
    sentiment: float  # -1.0 to 1.0
    keywords: List[str]
    emotion: Optional[str] = None
    confidence: Optional[float] = None

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

groq_client = Groq(api_key=groq_api_key)

# Use fastest Groq model for real-time processing
MODEL_NAME = "llama-3.3-70b-versatile"  # Fast and accurate

# System prompt for sentiment analysis
SYSTEM_PROMPT = """You are a sentiment analysis expert. Analyze the given text and return ONLY a valid JSON object with this exact structure:

{
    "sentiment": <float between -1.0 and 1.0, where -1 is very negative, 0 is neutral, 1 is very positive>,
    "keywords": [<array of 3-7 most important keywords or phrases from the text>],
    "emotion": <primary emotion: "joy", "sadness", "anger", "fear", "surprise", "neutral", etc.>,
    "confidence": <float between 0.0 and 1.0 indicating confidence in the analysis>
}

Rules:
- Be precise with sentiment scores
- Extract meaningful keywords that capture the essence
- Choose the most prominent emotion
- Return ONLY the JSON object, no markdown, no code blocks, no additional text
- Ensure proper JSON formatting"""

# Send the text to the LLM THAT IS Groq AI and get back the analysis.
async def analyze_sentiment_groq(text: str) -> dict:
    """Analyze sentiment using Groq API"""
    try:
        # Create chat completion
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Analyze this text: {text}"
                }
            ],
            model=MODEL_NAME,
            temperature=0.3,
            max_tokens=500,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"}
        )
        
        # Extract response content
        response_content = chat_completion.choices[0].message.content
        
        # Clean response - remove markdown code blocks if present
        response_content = response_content.strip()
        if response_content.startswith("```json"):
            response_content = response_content[7:]
        if response_content.startswith("```"):
            response_content = response_content[3:]
        if response_content.endswith("```"):
            response_content = response_content[:-3]
        response_content = response_content.strip()
        
        # Parse JSON
        result = json.loads(response_content)
        return result
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {str(e)}")
        print(f"Raw response: {response_content}")
        raise HTTPException(status_code=500, detail=f"Invalid JSON response from AI: {str(e)}")
    except Exception as e:
        print(f"Groq API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Sentiment Aura API",
        "version": "1.0.0",
        "ai_provider": "groq",
        "model": MODEL_NAME
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ai_provider": "groq",
        "model": MODEL_NAME,
        "api_key_configured": bool(groq_api_key)
    }

# Main endpoint that analyzes the text we send
# Validates text (not empty, not too long)
# Calls Groq AI to analyze sentiment
# Cleans and validates the response
# Returns sentiment score (-1 to 1), keywords, emotion, confidence

@app.post("/process_text", response_model=SentimentResponse)
async def process_text(request: TextRequest):
    """
    Process text and return sentiment analysis with keywords
    
    Args:
        request: TextRequest with text field
        
    Returns:
        SentimentResponse with sentiment score, keywords, emotion, and confidence
    """
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(request.text) > 5000:
        raise HTTPException(status_code=400, detail="Text too long (max 5000 characters)")
    
    try:
        # Call Groq AI service
        result = await analyze_sentiment_groq(request.text)
        
        # Validate and normalize response
        sentiment_score = float(result.get("sentiment", 0.0))
        sentiment_score = max(-1.0, min(1.0, sentiment_score))  # Clamp to [-1, 1]
        
        keywords = result.get("keywords", [])
        if not isinstance(keywords, list):
            keywords = []
        keywords = [str(k) for k in keywords][:10]  # Ensure strings, limit to 10
        
        emotion = str(result.get("emotion", "neutral"))
        confidence = float(result.get("confidence", 0.8))
        confidence = max(0.0, min(1.0, confidence))  # Clamp to [0, 1]
        
        return SentimentResponse(
            sentiment=sentiment_score,
            keywords=keywords,
            emotion=emotion,
            confidence=confidence
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Endpoint not found", "path": str(request.url)}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {"error": "Internal server error", "detail": str(exc)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)