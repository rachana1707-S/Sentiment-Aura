from dotenv import load_dotenv
import os

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")
print(f"GROQ_API_KEY loaded: {groq_key[:20] if groq_key else 'NOT FOUND'}...")
print(f"Full key length: {len(groq_key) if groq_key else 0}")