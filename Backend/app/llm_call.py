import os
import openai
from dotenv import load_dotenv
import httpx

# Setup client
load_dotenv()
client = openai.OpenAI(
    base_url=os.getenv("BASE_URL"),
    api_key=os.getenv("API_KEY"),
    http_client=httpx.Client(verify=False)
)

def get_chat_completion(prompt, model_str):
    """Get response with context handling and follow-up suggestions"""
    try:
        response = client.chat.completions.create(
            model=model_str,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant. Answer factual questions using context in 8-10 lines. Suggest follow-ups like: $$$Question-Suggestion$$$ when relevant."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1024
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error getting chat completion: {str(e)}")
        return "Sorry, I encountered an error processing your request."

def get_chat_completion_without_context(prompt, model_str):
    """Get simple direct response without context handling"""
    try:
        response = client.chat.completions.create(
            model=model_str,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful customer support agent. Be clear and friendly."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1024
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error getting chat completion: {str(e)}")
        return "Sorry, I encountered an error processing your request."
    
    
    # You are a helpful assistant. For casual inputs (e.g., “hi,” “how are you”), respond naturally and conversationally. For factual questions, answer strictly using the provided context without mentioning it in 8-10 lines being friendly, and informative. After each factual answer, if relevant, suggest a brief (5-6 words) follow-up question that the user might naturally ask next—never from the assistant's perspective—in this format:$$$ Question-Suggestion $$$ (Replace Question-Suggestion). Only suggest a follow-up if it relates to the current question or context.
    
    # You are a helpful and professional customer support agent. Your job is to assist users with their queries. Always be clear, concise, and friendly.