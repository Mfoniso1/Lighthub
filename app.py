import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Import backend logic
from file_processing import extract_text
from ai_logic import (
    add_documents_to_course,
    generate_rag_chat,
    detect_course_gaps,
    patch_context_gap,
    generate_panic_mode_data,
    get_course_collection
)

app = FastAPI(title="LightHub.edu AI Academic Survival Copilot Backend", version="1.0.0")

# Enable CORS for Next.js dev server access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temp upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Request schemas
class ChatRequest(BaseModel):
    course_id: str
    query: str
    history: Optional[List[dict]] = None


class GapRequest(BaseModel):
    course_id: str
    syllabus_text: str


class PatchRequest(BaseModel):
    course_id: str
    topic_name: str


class PanicRequest(BaseModel):
    course_id: str
    past_questions_text: Optional[str] = ""


@app.get("/")
def read_root():
    return {"message": "LightHub.edu AI Copilot API is running."}


@app.post("/api/upload")
async def upload_file(
    course_id: str = Form(...),
    file: UploadFile = File(...)
):
    """Handles course document uploads, parses them, and stores chunks in ChromaDB."""
    # Write incoming file to temporary storage
    temp_file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Parse document text
        text = extract_text(temp_file_path)
        if not text:
            raise HTTPException(status_code=400, detail="No readable text found in file. Ensure PDF is not corrupted or contains images and OCR is configured.")
            
        # Add to ChromaDB vector space
        chunks_added = add_documents_to_course(course_id, file.filename, text)
        
        return {
            "success": True,
            "filename": file.filename,
            "chunks_added": chunks_added,
            "message": f"Successfully parsed and indexed {file.filename} ({chunks_added} chunks added)."
        }
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file safely
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.get("/api/course-files")
def get_course_files(course_id: str):
    """Retrieves unique list of indexed file names from the course's namespace."""
    try:
        collection = get_course_collection(course_id)
        get_data = collection.get(include=["metadatas"])
        
        unique_files = set()
        if get_data and "metadatas" in get_data and get_data["metadatas"]:
            for meta in get_data["metadatas"]:
                if meta and "source" in meta:
                    unique_files.add(meta["source"])
                    
        return {"course_id": course_id, "files": list(unique_files)}
    except Exception as e:
        print(f"Error fetching course files: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    """Generates RAG chat completion for course inquiries."""
    try:
        response = generate_rag_chat(req.course_id, req.query, req.history)
        return {"text": response}
    except Exception as e:
        print(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/detect-gaps")
def detect_gaps_endpoint(req: GapRequest):
    """Compares outline/syllabus topics with vector documents to locate coverage gaps."""
    try:
        results = detect_course_gaps(req.course_id, req.syllabus_text)
        return results
    except Exception as e:
        print(f"Gap detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/patch-gap")
def patch_gap_endpoint(req: PatchRequest):
    """Generates AI notes to fill in a missing syllabus topic."""
    try:
        notes = patch_context_gap(req.course_id, req.topic_name)
        return {"notes": notes}
    except Exception as e:
        print(f"Gap patch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/panic-mode")
def panic_mode_endpoint(req: PanicRequest):
    """Generates revision timelines and cheat cards in Panic Mode."""
    try:
        data = generate_panic_mode_data(req.course_id, req.past_questions_text)
        return data
    except Exception as e:
        print(f"Panic mode error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    # Load server settings from environment
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    print(f"Starting API Server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
