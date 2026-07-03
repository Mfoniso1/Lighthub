# Lighthub.edu — Pitch & Presentation Guide 🎤

Use this document to prepare for your hackathon pitch, demo day, or social media announcements.

## 🌟 The Elevator Pitch

"Across African universities, millions of undergraduates face a massive structural problem: **incomplete lectures and missed syllabus topics**. Disruptions like strikes, missing lecturers, and rushed semesters leave students entirely on their own to connect the dots before exams. 

**Lighthub.edu** is an AI Academic Survival Copilot designed specifically to solve this. We ingest raw, chaotic course materials and syllabus PDFs, cross-reference them in real-time, and detect exactly what topics were missed in class. Through our 'Panic Mode' and AI Tutoring, we bridge the gap between what was taught and what will actually be on the exam."

---

## 💥 The Problem We Solve
1. **The 'Missed Syllabus' Crisis:** Lecturers rarely finish the syllabus, but exams still cover everything.
2. **Scattered Resources:** Students rely on fragmented WhatsApp group notes, old PDFs, and partial slides.
3. **Information Overload:** A week before exams, students don't know *what* they don't know. 

## 🛠 The Solution (Features)
* 🧠 **AI Gap Detector:** Upload your syllabus and your course notes. Lighthub instantly cross-references them and highlights exactly which topics were missed in class.
* 🚨 **Exam Panic Mode:** A dedicated crash-course environment that generates instant summaries and practice questions for the missed topics.
* 🤖 **Context-Aware RAG Copilot:** A chat interface backed by ChromaDB and Claude 3.5 Sonnet that actually *understands* the uploaded local Nigerian/African university materials, not just generic web data.

---

## 💻 Technical Architecture

* **Frontend:** Next.js, TailwindCSS (Responsive, glassmorphic premium UI)
* **Backend:** Python, FastAPI (High-performance API handling)
* **AI & Data:**
  * **OpenRouter** routing to **Claude 3.5 Sonnet** for top-tier reasoning.
  * **ChromaDB** for localized Vector Embeddings (RAG).
  * **pdfplumber/PyPDF** for robust document ingestion and text extraction.

---

## 🚀 Live Demo Script / Flow

1. **The Setup:** "Imagine you are a student taking COS 141. The lecturer skipped three weeks of classes, and the exam is on Monday."
2. **The Upload:** Show the user uploading the official Course Syllabus PDF and their personal class notes. 
3. **The Magic (Gap Detector):** Click the "Gap Detector" tab. Point out how the AI successfully parsed the vector database and identified that *Unit 4: Microcontrollers* was completely missing from the notes.
4. **The Resolution (Panic Mode):** Click into "Panic Mode" to show the AI instantly generating a crash-course study guide for the missing Unit 4.
5. **The Chat:** Ask the AI a highly specific question about the uploaded document to prove it's using RAG (Retrieval-Augmented Generation) and not just hallucinating.

---

## 📱 Social Media Announcement Draft

**Day 1 of the Hackathon. Sprint started. ⏱️**

No slides. No mockups. Just real code and a real problem.

Across Africa, university students face a massive structural disadvantage: rushed semesters and incomplete lectures. You're taught 60% of the syllabus, but examined on 100%.

We are building **Lighthub.edu** to fix this. 
It’s an AI Academic Survival Copilot that ingests your chaotic course PDFs, cross-references them with the official syllabus, and detects exactly what topics you missed in class—then teaches them to you before exam day.

Stack: Next.js + FastAPI + ChromaDB + Claude 3.5 Sonnet.

Time to build. 🚀 #Hackathon #AI #EdTech #Lighthub
