# Run: uvicorn main:app --reload

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import mysql.connector

from face_recognition_realtime import run_once_and_return_result

app = FastAPI()

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="quanlylophoc"
    )

    
@app.post("/face-checkin/")
def detect_face_once():
    return run_once_and_return_result()
