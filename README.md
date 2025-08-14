# Introduction 
This project is a plug-and-play AI chatbot widget that can be embedded into any web application. It is built using **React + Vite** for the frontend and **Python FastAPI** for the backend. The chatbot uses a **Retrieval-Augmented Generation (RAG)** pipeline to provide intelligent, context-aware responses by retrieving relevant information from custom documents or data sources before generating an answer. This makes it suitable for use in documentation sites, customer support systems, knowledge bases, and more.


# ▶️1. Installation process
### Prerequisites
```bash
 Node.js - 22.15.0
 Python - 3.13.3
 pip - 25.1.1
 npm - 10.9.2
```


# ▶️2. Software dependencies
### Frontend (React + Vite + Typescript)

Install using `npm install` inside the frontend directory.
```bash
"dependencies": {
  "axios": "^1.10.0",                     // HTTP client
  "clsx": "^2.1.1",                       // Utility for conditional classNames
  "motion": "^12.15.0",                   // Animation library
  "react": "^19.1.0",                     // React core
  "react-dom": "^19.1.0",                 // React DOM renderer
  "react-icons": "^5.5.0",                // Popular icon library
  "react-router-dom": "^7.6.1",           // Routing for React apps
  "react-speech-recognition": "^4.0.1",   // Speech-to-text support
  "react-toastify": "^11.0.5",            // Toast notifications
}
```
### Backend (Python + FastAPI)

Install using `pip install -r requirements.txt` inside the backend directory.
```bash
fastapi                # Web framework
uvicorn                # ASGI server
python-dotenv          # Load environment variables from .env
httpx                  # Async HTTP client
requests               # Synchronous HTTP client
python-multipart       # For handling form data
sentence-transformers  # Embedding generation for NLP
faiss-cpu              # Vector search library
PyMuPDF                # PDF parsing
numpy                  # Numerical operations
openai                 # OpenAI API integration
```



# ▶️3. API references
```bash
API_KEY= "genw API Key"
BASE_URL= "root endpoint"
```

# ▶️4. Build & Run Instructions

Follow the steps below to set up and run the project, which includes a React frontend, a FastAPI backend, and a pluggable chatbot widget.

---

### 1. Clone the Repository

```bash
git clone https://github.com/SurajSG23/ChatBot-POC.git
cd ChatbotPlatform
```
### 2. Frontend Setup

Navigate to the frontend directory and start the development server:

```bash
cd ChatbotPlatform/frontend
npm install       # Install dependencies
npm run dev       # Start the development server
```
### 3. Backend Setup
Navigate to the Backend directory and start the development server:

```bash
cd ChatbotPlatform/Backend
```
Activate the virtual environment:
```bash
venv\Scripts\activate       # Windows
# or
source venv/bin/activate   # macOS/Linux
```
Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```
# ▶️5. Contribute

1. **Fork the repository**  
   Click the **Fork** button on the top right of this page.

2. **Clone your forked repo**

   ```bash
   git clone https://github.com/your-username/your-fork.git
   cd your-fork
    ```
3. **Clone your forked repo**
   ```bash
    git checkout -b your-feature-name
    ```
4. **Make your changes**
Implement your feature or fix.

5. Commit your changes

```bash
git add .
git commit -m "Describe your change"
```

6. Push to your branch

```bash
git push origin your-feature-name
```
