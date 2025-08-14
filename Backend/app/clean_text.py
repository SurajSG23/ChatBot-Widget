import re
def clean_text(text):
    
    cleaned = re.sub(r'[^A-Za-z0-9\s]', '', text)

    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned
