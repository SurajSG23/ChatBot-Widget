def split_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list[str]:
    
    words = text.split()
    chunks = []
    
    if overlap >= chunk_size:
        raise ValueError("Overlap must be smaller than chunk size")
    
    for start in range(0, len(words), chunk_size - overlap):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
    
    return chunks