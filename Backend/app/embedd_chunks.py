from sentence_transformers import SentenceTransformer

def embedd_chunks(chunks, model):    
    new_chunks = []

    for chunk in chunks:
        embeddings = model.encode(chunk, convert_to_numpy=True)
        new_chunks.append(embeddings)
        
    return new_chunks