import os
import json
from dotenv import load_dotenv
import chromadb
from chromadb.utils import embedding_functions

# Load environment variables
load_dotenv()

# Setup ChromaDB persistent database path
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
os.makedirs(DB_PATH, exist_ok=True)

# Persistent Chroma client
chroma_client = chromadb.PersistentClient(path=DB_PATH)

# Using default embedding function (sentence-transformers / ONNX)
default_ef = embedding_functions.DefaultEmbeddingFunction()

# ── OpenRouter client (OpenAI-compatible) ──────────────────────────────────────
openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
LLM_MODEL = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet")

if openrouter_api_key:
    try:
        from openai import OpenAI
        ai_client = OpenAI(
            api_key=openrouter_api_key,
            base_url="https://openrouter.ai/api/v1",
        )
        print(f"[OK] OpenRouter client initialized. Model: {LLM_MODEL}")
    except Exception as e:
        print(f"Error initializing OpenRouter client: {e}")
        ai_client = None
else:
    print("WARNING: OPENROUTER_API_KEY not set. Running in simulation fallback mode.")
    ai_client = None
# ──────────────────────────────────────────────────────────────────────────────


def get_course_collection(course_id: str):
    """Retrieves or creates a ChromaDB collection for the course namespace."""
    # Ensure collection name conforms to ChromaDB guidelines (3-63 chars, alphanumeric/underscores/hyphens)
    safe_name = f"course_{course_id.lower().replace('-', '_')}"
    return chroma_client.get_or_create_collection(
        name=safe_name, 
        embedding_function=default_ef
    )


def add_documents_to_course(course_id: str, file_name: str, text: str):
    """Chunks and indexes document text into the course's vector store namespace."""
    from file_processing import chunk_text
    
    chunks = chunk_text(text, chunk_size=800, chunk_overlap=150)
    if not chunks:
        return 0
        
    collection = get_course_collection(course_id)
    
    ids = [f"{file_name}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"source": file_name, "chunk_index": i} for i in range(len(chunks))]
    
    collection.add(
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )
    return len(chunks)


def search_course_context(course_id: str, query: str, n_results: int = 5) -> list[str]:
    """Retrieves relevant chunks from the course's namespace matching the query."""
    try:
        collection = get_course_collection(course_id)
        # Check if the collection has any documents
        count = collection.count()
        if count == 0:
            return []
            
        results = collection.query(
            query_texts=[query],
            n_results=min(n_results, count)
        )
        # Flatten documents list
        documents = []
        if results and "documents" in results and results["documents"]:
            for docs in results["documents"]:
                documents.extend(docs)
        return documents
    except Exception as e:
        print(f"Error querying ChromaDB: {e}")
        return []


def call_llm(prompt: str, system_prompt: str = "") -> str:
    """Calls OpenRouter (OpenAI-compatible) with a fallback to mock data if key is missing."""
    if not ai_client:
        return _get_fallback_llm_response(prompt)

    try:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = ai_client.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            max_tokens=4000,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenRouter API: {e}")
        return f"Error connecting to AI Provider via OpenRouter: {e}\n\n[Fallback simulation mode triggered]"


def generate_rag_chat(course_id: str, query: str, history: list[dict] = None) -> str:
    """Answers a course query utilizing RAG and grounding context."""
    # Retrieve relevant course materials
    context_chunks = search_course_context(course_id, query, n_results=4)
    
    context_text = "\n---\n".join(context_chunks)
    
    system_prompt = (
        "You are the 'LightHub.edu AI Study Copilot', an empathetic, smart academic assistant "
        "built specifically for African university undergraduates who face disrupted or incomplete learning.\n"
        "Your tone should be highly encouraging, plain-spoken, non-judgmental, and practical.\n"
        "Explain complex technical concepts using relatable local analogies (e.g., transport in Lagos, local market bargaining, power grids).\n"
        "CRITICAL: Ground your answers STRICTLY in the provided course context. If the concept is not mentioned "
        "in the context, first answer based on general knowledge but explicitly state that this was NOT found in the "
        "uploaded course materials so the student is aware of the discrepancy."
    )
    
    prompt = f"Grounding Context:\n{context_text}\n\nUser Question: {query}\n"
    if history:
        prompt = f"History: {json.dumps(history[-4:])}\n\n" + prompt
        
    return call_llm(prompt, system_prompt)


def detect_course_gaps(course_id: str, syllabus_text: str) -> dict:
    """Compares the syllabus topics against uploaded course documents."""
    # 1. Ask LLM to extract syllabus modules and discrete topics
    extraction_prompt = (
        "Extract a list of modules and sub-topics from the following course syllabus/outline text.\n"
        "Respond in structured JSON format with this schema:\n"
        "{\n"
        "  \"modules\": [\n"
        "    {\n"
        "      \"id\": 1,\n"
        "      \"title\": \"Module 1 Title\",\n"
        "      \"topics\": [\"Topic 1\", \"Topic 2\"]\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
        f"Syllabus Text:\n{syllabus_text}"
    )
    
    extracted_json_str = call_llm(extraction_prompt, "You are a precise JSON extractor. Output ONLY valid JSON.")
    
    try:
        # Strip code blocks if LLM returns them
        clean_json = extracted_json_str.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        syllabus_data = json.loads(clean_json.strip())
    except Exception as e:
        print(f"Failed to parse syllabus JSON, using static fallback: {e}")
        # Static fallback matching the hardware course from visual prototype
        syllabus_data = {
            "modules": [
                {
                    "id": 1,
                    "title": "Module 1: Low-Level Storage & System Architecture",
                    "topics": ["Motherboard Bus Architectures (PCIe, SATA)", "BIOS/UEFI Configuration & Boot Flags", "Interrupt Vectors & INT 13h Disk Operations"]
                },
                {
                    "id": 2,
                    "title": "Module 2: POST Diagnostics & Diagnostic Routine",
                    "topics": ["Power-On Self-Test (POST) Failure Sequence", "Audible Beep Code Diagnostic Matrices"]
                },
                {
                    "id": 3,
                    "title": "Module 3: Non-Volatile Memory Registers",
                    "topics": ["CMOS Battery Voltage Decay & Clock Drift", "NVRAM Variables Configuration Protection"]
                }
            ]
        }

    # 2. For each topic, run a similarity check against ChromaDB
    collection = get_course_collection(course_id)
    doc_count = collection.count()
    
    analyzed_modules = []
    total_topics = 0
    covered_topics = 0
    gaps_count = 0

    for mod in syllabus_data.get("modules", []):
        mod_topics = []
        mod_status = "covered"
        mod_gaps = 0
        
        for topic in mod.get("topics", []):
            total_topics += 1
            if doc_count == 0:
                # No files uploaded yet, all topics are missing
                status = "missing"
                source = "No matching context found"
                mod_gaps += 1
                gaps_count += 1
            else:
                # Query ChromaDB for this topic
                results = collection.query(
                    query_texts=[topic],
                    n_results=1
                )
                
                # Check distances/scores to see if it exists
                # In Chroma, smaller distance means more similar. Let's assume a threshold of 1.2 for cosine/L2
                is_match = False
                source_file = "No matching context found"
                
                if results and "distances" in results and results["distances"] and results["distances"][0]:
                    distance = results["distances"][0][0]
                    if distance < 1.1: # Topic exists in files
                        is_match = True
                        if results["metadatas"] and results["metadatas"][0]:
                            source_file = results["metadatas"][0][0].get("source", "Course Materials")
                
                if is_match:
                    status = "covered"
                    source = source_file
                    covered_topics += 1
                else:
                    status = "missing"
                    source = "No matching context found"
                    mod_gaps += 1
                    gaps_count += 1
            
            mod_topics.append({
                "name": topic,
                "status": status,
                "source": source
            })
            
        if mod_gaps == len(mod.get("topics", [])):
            mod_status = "missing"
        elif mod_gaps > 0:
            mod_status = "partial"
        else:
            mod_status = "covered"
            
        analyzed_modules.append({
            "id": mod.get("id"),
            "title": mod.get("title"),
            "status": mod_status,
            "gapsCount": mod_gaps,
            "topics": mod_topics
        })

    coverage_percentage = int((covered_topics / total_topics) * 100) if total_topics > 0 else 0

    return {
        "coverage": coverage_percentage,
        "gaps_count": gaps_count,
        "modules": analyzed_modules
    }


def patch_context_gap(course_id: str, topic_name: str) -> str:
    """Generates supplementary AI notes grounded in syllabus topic context using Claude."""
    system_prompt = (
        "You are the LightHub.edu AI Study Copilot. A student is missing lectures or study notes on a specific syllabus topic. "
        "Generate a clear, high-yield, comprehensive set of study notes for this topic.\n"
        "Explain it using simple language and highly relatable undergraduate analogies (e.g. Nigerian transport, campus food lines).\n"
        "Include a 'Key Terminology' section, an 'Exam Focus' note, and a quick active-recall checkpoint question."
    )
    
    prompt = f"Please generate comprehensive study notes to cover the following missing syllabus topic: {topic_name}"
    return call_llm(prompt, system_prompt)


def generate_panic_mode_data(course_id: str, past_questions_text: str = "") -> dict:
    """Generates emergency revision packages: flashcards, schedule, and cheat sheets."""
    # Retrieve general context from vector database
    context_chunks = search_course_context(course_id, "important exam concepts high yield formulas", n_results=10)
    context_text = "\n".join(context_chunks)

    system_prompt = (
        "You are the LightHub.edu AI Study Copilot. Triggered in 'EXAM IN 48 HOURS' Panic Mode.\n"
        "Generate a structured survival revision plan based on course materials and past questions (if provided).\n"
        "You must respond strictly in JSON format matching the schema below. Do not include markdown wraps (like ```json) in your content if possible, or ensure it is easily strip-able.\n"
        "JSON Schema:\n"
        "{\n"
        "  \"schedule\": [\n"
        "     {\"time\": \"Hours 0-12 (Block A)\", \"phase\": \"Phase Name\", \"task\": \"Priority Task Description\", \"complete\": false}\n"
        "  ],\n"
        "  \"snippets\": [\n"
        "     {\"id\": 1, \"topic\": \"Topic Name\", \"detail\": \"One-sentence high-yield summary breakdown.\"}\n"
        "  ],\n"
        "  \"flashcards\": [\n"
        "     {\"question\": \"Active recall question?\", \"answer\": \"Clear, high-yield answer explanation.\"}\n"
        "  ]\n"
        "}"
    )

    prompt = (
        f"Generate the Panic Mode response based on this course context:\n{context_text}\n\n"
        f"And these past questions/outlines (if any):\n{past_questions_text}"
    )

    json_str = call_llm(prompt, system_prompt)
    
    try:
        # Standardize cleaning of JSON wrappers
        clean_json = json_str.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        return json.loads(clean_json.strip())
    except Exception as e:
        print(f"Error parsing Panic Mode JSON: {e}")
        # Return fallback mock structure built around course context
        return {
            "schedule": [
                { "time": "Hours 0 - 12 (Block A)", "phase": "Core Gap Aggression", "task": "Scan vector-recommended definitions for hardware maintenance outlines.", "complete": True },
                { "time": "Hours 12 - 24 (Block B)", "phase": "Diagnostic Deep-Dive", "task": "Study Motherboard beep codes and interrupt vectors.", "complete": False },
                { "time": "Hours 24 - 36 (Block C)", "phase": "Registers and Batteries", "task": "Verify CMOS battery decay rates and NVRAM protection settings.", "complete": False },
                { "time": "Hours 36 - 48 (Block D)", "phase": "Final Recall Sprint", "task": "Run rapid active flashcard checks and review cheat sheet notes.", "complete": False }
            ],
            "snippets": [
                { "id": 1, "topic": "Interrupt Vectors", "detail": "Vectors point directly to BIOS instructions; INT 13h handles disk configuration operations." },
                { "id": 2, "topic": "Beep Codes", "detail": "Power supply failure results in continuous repeating short beeps; display adapter issue causes 1 long, 2 short beeps." },
                { "id": 3, "topic": "CMOS Battery", "detail": "Lithium cell keeps CMOS clock registers alive when system power is disconnected; decays below 3.0V lose time settings." }
            ],
            "flashcards": [
                { "question": "What is the primary role of the POST sequence?", "answer": "To run operational integrity diagnostics on mainboard components before running the OS bootloader." },
                { "question": "How do CMOS clocks keep time when unplugged?", "answer": "A CR2032 button cell battery maintains low-power clock ticks on the motherboard RTC register." }
            ]
        }


def _get_fallback_llm_response(prompt: str) -> str:
    """Mock fallback outputs when Anthropic API is not connected."""
    prompt_lower = prompt.lower()
    
    if "extraction_prompt" in prompt_lower or "syllabus" in prompt_lower:
        return json.dumps({
            "modules": [
                {
                    "id": 1,
                    "title": "Module 1: Low-Level Storage & System Architecture",
                    "topics": ["Motherboard Bus Architectures (PCIe, SATA)", "BIOS/UEFI Configuration & Boot Flags", "Interrupt Vectors & INT 13h Disk Operations"]
                },
                {
                    "id": 2,
                    "title": "Module 2: POST Diagnostics & Diagnostic Routine",
                    "topics": ["Power-On Self-Test (POST) Failure Sequence", "Audible Beep Code Diagnostic Matrices"]
                },
                {
                    "id": 3,
                    "title": "Module 3: Non-Volatile Memory Registers",
                    "topics": ["CMOS Battery Voltage Decay & Clock Drift", "NVRAM Variables Configuration Protection"]
                }
            ]
        })
    elif "panic" in prompt_lower:
        return json.dumps({
            "schedule": [
                { "time": "Hours 0 - 12 (Block A)", "phase": "Core Gap Aggression", "task": "Study motherboard configuration vectors and BIOS settings.", "complete": True },
                { "time": "Hours 12 - 24 (Block B)", "phase": "Diagnostic Diagnostics", "task": "Practice audible beep code diagnostic grids.", "complete": False },
                { "time": "Hours 24 - 36 (Block C)", "phase": "NVRAM Registers", "task": "Drill down CMOS battery decays and clock drifts.", "complete": False },
                { "time": "Hours 36 - 48 (Block D)", "phase": "Final Matrix Review", "task": "Go through high yield summaries and test yourself using active flashcards.", "complete": False }
            ],
            "snippets": [
                { "id": 1, "topic": "Interrupt Vectors (INT 13h)", "detail": "Main system configuration interrupts map directly to standard disk operations." },
                { "id": 2, "topic": "POST Diagnostics", "detail": "Audible matrices map sound count/length to motherboard component failure nodes." },
                { "id": 3, "topic": "CMOS Drift", "detail": "Drifts occur when voltage of CR2032 cells drops below 3.0V, resetting BIOS configuration." }
            ],
            "flashcards": [
                { "question": "What happens when a CMOS battery dies?", "answer": "The system clock drifts and BIOS configuration parameters revert to factory default." },
                { "question": "How are bios interrupt vectors accessed?", "answer": "They are stored in a dedicated low-memory address space mapped on startup." }
            ]
        })
    else:
        # Standard chat fallback response
        return (
            "Hi! I am currently running in **Simulation Mode** because the `ANTHROPIC_API_KEY` is not set.\n\n"
            "Here is how RAG will work: when you upload your files, I read and index them into ChromaDB. "
            "When you ask a question like this, I perform vector queries to retrieve relevant paragraphs, "
            "and pass them to Claude to generate an accurate, course-grounded tutorial. Set up the API key in your `.env` to start testing real RAG queries!"
        )
