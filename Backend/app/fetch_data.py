import faiss
import pickle
import os

def fetch_data(prompt,project,model):
    index_path = os.path.abspath(f"FAISS/{project}/faiss_index.index")

    index = faiss.read_index(index_path)

    with open(f"FAISS/{project}/corpus.pkl", "rb") as f:
        corpus = pickle.load(f)

    query_vector = model.encode([prompt]).astype('float32')

    k = 5
    distance, indices = index.search(query_vector, k)
    top_matches = []
    
    for idx in indices[0]:
        top_matches.append(corpus[idx])

    return top_matches

