import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

print("Gemini API Key:", os.getenv("API_KEY"))  # Debugging line to check if the API key is loaded

# Configure Gemini client with API key
genai.configure(api_key=os.getenv("API_KEY"))

def get_chat_completion(prompt: str, model_str: str = "gemini-2.0-flash"):
    print("hello")
    # try:
    #     model = genai.GenerativeModel(model_str)
        
    #     response = model.generate_content(
    #         [
    #             "You are a helpful assistant. Answer factual questions in 8–10 lines. "
    #             "When relevant, suggest follow-ups like: $$$Question-Suggestion$$$",
    #             prompt
    #         ],
    #         generation_config={
    #             "temperature": 0.8,
    #             "max_output_tokens": 1024,
    #         }
    #     )

    #     return response.text if response and response.text else "No response generated."

    # except Exception as e:
    #     print(f"[ERROR] Gemini API call failed: {str(e)}")
    #     return "Sorry, I encountered an error processing your request."

