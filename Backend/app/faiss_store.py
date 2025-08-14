import faiss
import numpy as np
import os
import pickle

def faiss_store(chunks, original_texts, source):
    """Store text chunks in FAISS index and save original texts"""
    # Create FAISS directory if needed
    os.makedirs(f"FAISS/{source}", exist_ok=True)
    
    # Prepare paths and vectors
    index_path = f"FAISS/{source}/faiss_index.index"
    corpus_path = f"FAISS/{source}/corpus.pkl"
    vectors = np.array(chunks).astype('float32')
    
    # Load existing or create new index
    if os.path.exists(index_path):
        index = faiss.read_index(index_path)
        with open(corpus_path, "rb") as f:
            existing_texts = pickle.load(f)
        original_texts = existing_texts + original_texts
    else:
        index = faiss.IndexFlatL2(vectors.shape[1])  # Get dimension from vectors
    
    # Update index and save
    index.add(vectors)
    faiss.write_index(index, index_path)
    with open(corpus_path, "wb") as f:
        pickle.dump(original_texts, f)