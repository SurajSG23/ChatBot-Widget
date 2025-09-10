import os
from dotenv import load_dotenv
from google import genai

# Load API key from .env
load_dotenv()

client = genai.Client(api_key=os.getenv("API_KEY"))

def get_chat_completion(prompt: str, model_str: str = "gemini-2.0-flash"):
    try:
        response = client.models.generate_content(
            model=model_str,
            contents=[
                "You are a helpful assistant. Answer factual questions in 8-10 lines. "
                "When relevant, suggest follow-ups like: $$$Question-Suggestion$$$",
                prompt,
            ]
        )
        return response.text if response and hasattr(response, "text") else "No response generated."

    except Exception as e:
        print(f"[ERROR] Gemini API call failed: {str(e)}")
        return "Sorry, I encountered an error processing your request."
