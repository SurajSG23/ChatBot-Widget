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
                (
                    "You are a helpful assistant.\n\n"
                    "Rules:\n"
                    "1. If the user asks a factual or knowledge-based question, reply in 8–10 lines.\n"
                    "   - At the end, suggest 1–2 follow-up questions wrapped inside $$$ … $$$.\n\n"
                    "2. If the user sends a casual greeting or small talk "
                    "(examples: 'hey', 'hello', 'hi', 'good morning', 'how are you'), "
                    "reply briefly and naturally, like a human conversation. "
                    "Do NOT give long explanations or follow-up questions in this case."
                ),
                prompt,
            ],
            config={
                "temperature": 0.8,        
                "max_output_tokens": 1024 
            }
        )

        return response.text if response and hasattr(response, "text") else "No response generated."

    except Exception as e:
        print(f"[ERROR] Gemini API call failed: {str(e)}")
        return "Sorry, I encountered an error processing your request."
