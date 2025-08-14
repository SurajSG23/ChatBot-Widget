import json

def validate_url(url: str) -> str:
    try:
        with open("source_url_map.json", "r") as f:
            mappings = json.load(f)
        for source, saved_url in mappings.items():
            if url in saved_url or saved_url in url:
                return source
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    
    return "AI Assistant"