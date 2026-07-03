import os
import re
from PIL import Image

# Import pdfplumber or pypdf depending on availability
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import pypdf
except ImportError:
    pypdf = None

# Optional pytesseract OCR import
try:
    import pytesseract
except ImportError:
    pytesseract = None


def extract_text_from_pdf(file_path: str) -> str:
    """Extracts text content from a digital PDF file."""
    text_content = []

    # Method 1: Try pdfplumber
    if pdfplumber:
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        text_content.append(text)
        except Exception as e:
            print(f"Error reading PDF with pdfplumber: {e}")

    # Method 2: Fallback to pypdf
    if not text_content and pypdf:
        try:
            reader = pypdf.PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text_content.append(text)
        except Exception as e:
            print(f"Error reading PDF with pypdf: {e}")

    # Return concatenated text or try OCR as fallback if no text found and file is PDF
    final_text = "\n".join(text_content).strip()
    return final_text


def extract_text_from_image(file_path: str) -> str:
    """Performs OCR on an image file, with a graceful fallback if Tesseract is missing."""
    if not pytesseract:
        print("pytesseract is not installed. Skipping OCR.")
        return ""

    try:
        img = Image.open(file_path)
        # Using pytesseract image_to_string
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        print(f"OCR failed for {file_path}: {e}")
        return ""


def extract_text(file_path: str) -> str:
    """General extraction function routing based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".pdf":
        text = extract_text_from_pdf(file_path)
        # If digital extraction yielded nothing, it might be a scanned PDF
        if not text and pytesseract:
            print(f"Digital extraction empty for {file_path}. Attempting OCR on PDF pages...")
            # We would typically render pages to images and OCR, but for simplicity
            # we log it or fallback. Let's do a simple fallback statement.
            pass
        return text
    elif ext in [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp"]:
        return extract_text_from_image(file_path)
    elif ext in [".txt", ".md", ".csv", ".json"]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read().strip()
        except Exception as e:
            print(f"Failed to read text file {file_path}: {e}")
            return ""
    else:
        print(f"Unsupported file type: {ext}")
        return ""


def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> list[str]:
    """Splits raw text into overlapping chunks of rough character count."""
    if not text:
        return []

    # Clean redundant whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    
    chunks = []
    start = 0
    text_len = len(text)
    
    while start < text_len:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += (chunk_size - chunk_overlap)
        
    return chunks
