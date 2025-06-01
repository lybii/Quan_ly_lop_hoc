# Run: uvicorn api:app --reload
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from test import FaceRecognitionByLecture

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import mysql.connector

from database import get_checked_in_users_by_lecture_id
from database import add_face_recognition

app = FastAPI()

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="quanlylophoc"
    )

# Cho phép gọi API từ bất kỳ frontend nào (bạn có thể giới hạn lại)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LectureRequest(BaseModel):
    lecture_id: int

@app.post("/face-checkin/")
def face_checkin(request: LectureRequest):
    try:
        fr = FaceRecognitionByLecture(lecture_id=request.lecture_id)
        fr.run_with_live_camera()
        
        checked_in_users = fr.checked_in_users
        return {
            "message": "Camera closed, recognition finished.",
            "checked_in_users": checked_in_users
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
