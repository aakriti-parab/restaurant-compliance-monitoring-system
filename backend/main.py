from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend Working"}


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    image_bytes = await file.read()

    prompt = """
You are a restaurant compliance AI.

Analyze this restaurant image.

Return ONLY valid JSON in exactly this format:

{
  "cap":"Yes",
  "gloves":"No",
  "behind_counter":2,
  "front_counter":5,
  "occupied_tables":3,
  "empty_tables":2
}

Rules:
- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT use ```json.
- Do NOT add any explanation.
- Numbers must be integers.
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

    result = response.text.strip()

    print("Gemini Raw Response:")
    print(result)

    # Remove markdown if Gemini adds it
    result = result.replace("```json", "")
    result = result.replace("```", "")
    result = result.strip()

    try:
        data = json.loads(result)
        return data

    except Exception as e:
        print("JSON Error:", e)

        return {
            "cap": "Unknown",
            "gloves": "Unknown",
            "behind_counter": 0,
            "front_counter": 0,
            "occupied_tables": 0,
            "empty_tables": 0,
            "raw_response": result,
        }