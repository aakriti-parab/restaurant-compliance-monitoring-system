from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv
import google.generativeai as genai
import os
load_dotenv()
print(os.getenv("GEMINI_API_KEY")[:10])

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {"message": "Backend is working!"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    image_bytes = await file.read()

    prompt = """
    Analyze this restaurant image and return:

    1. Is staff wearing a cap? (Yes/No)
    2. Is staff wearing gloves? (Yes/No)
    3. Number of people behind the counter
    4. Number of people in front of the counter
    5. Number of occupied tables
    6. Number of empty tables

    Give a short structured response.
Do not use markdown symbols like **, *, # or bullet formatting.
Return plain text only.
    """

    response = model.generate_content(
        [
            prompt,
            {
                "mime_type": file.content_type,
                "data": image_bytes,
            },
        ]
    )
    print("Gemini Response:")
    print(response.text)
    return {
        "analysis": response.text
    }