import os
import json
from fastapi import FastAPI, File, UploadFile, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

# Import local modules
from .extract_text import extract_text  
from .clean_text import clean_text
from .create_chunks import split_text
from .add_metadata import add_metadata
from .embedd_chunks import embedd_chunks
from .faiss_store import faiss_store
from .fetch_data import fetch_data
from .llm_call import get_chat_completion, get_chat_completion_without_context
from .get_prompt import get_prompt
from .validate_url import validate_url

app = FastAPI()

# Initialize model
model = SentenceTransformer('all-mpnet-base-v2')

# CORS Configuration
MAPPING_FILE = "source_url_map.json"

try:
    with open(MAPPING_FILE) as f:   
        data = json.load(f)
        origins = [url.rstrip("/") for url in data.values()]
except:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(url: str = Form(...), source: str = Form(...), files: List[UploadFile] = File(...)):
    try:
        # Save source-url mapping
        try:
            with open(MAPPING_FILE, "r") as f:
                mappings = json.load(f)
            if source not in mappings:
                mappings[source] = url
                with open(MAPPING_FILE, "w") as f:
                    json.dump(mappings, f)
        except:
            with open(MAPPING_FILE, "w") as f:
                json.dump({source: url}, f)

        # Process files
        os.makedirs("uploaded_docs", exist_ok=True)
        for file in files:
            file_location = f"uploaded_docs/{file.filename}"
            with open(file_location, "wb") as f:
                f.write(await file.read())
            
            text = extract_text(file_location)
            cleaned_text = clean_text(text.lower())
            chunks = split_text(cleaned_text)
            chunks_with_metadata = add_metadata(chunks, source)
            embedded_chunks = embedd_chunks(chunks_with_metadata, model)
            faiss_store(embedded_chunks, chunks_with_metadata, source)
            
            os.remove(file_location)
        
        if os.path.exists("uploaded_docs"):
            os.rmdir("uploaded_docs")
            
        return "Success"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recievePrompt/")
async def recieve_prompt(request: Request):
    try:
        data = json.loads(await request.body())
        prompt_str = data["inputValue"]
        model_str = data["model"]
        project = data["project"]
        
        if project == "AI Assistant":
            return get_chat_completion_without_context(prompt_str, model_str)
        
        response = fetch_data(prompt_str, project, model)
        context_section = "\n".join([f"Context {i+1}: {chunk}" for i, chunk in enumerate(response)])
        final_prompt = get_prompt(prompt_str, context_section)
        return get_chat_completion(final_prompt, model_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/fetchProjects/")
async def fetch_projects(request: Request):
    url = request.query_params.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="Missing URL")
    return validate_url(str(url))

@app.get("/fetchAllProjects/")
async def fetch_all_projects():
    if not os.path.exists("FAISS"):
        return []
    return os.listdir("FAISS")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}