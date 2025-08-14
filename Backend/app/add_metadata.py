import json
from datetime import datetime

def add_metadata(chunks, source):
    for i in range(len(chunks)):
        timestamp = datetime.now().isoformat()
        metadata = {
            "text": chunks[i],
            "Source": source,
            "timestamp": timestamp
        }
        chunks[i] = json.dumps(metadata)
    return chunks
