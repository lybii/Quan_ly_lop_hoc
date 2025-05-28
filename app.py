#Run: uvicorn app:app --reload

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import mysql.connector

app = FastAPI()

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="quanlylophoc"
    )

class FaceRecognition(BaseModel):
    id: Optional[int] = None
    ten: str
    user_id: int
    lecture_id: int
    time_checkin: Optional[datetime] = None  # Thời gian được điểm danh

# Lấy tất cả bản ghi face recognition
@app.get("/faces/", response_model=List[FaceRecognition])
def get_faces():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, ten, user_id, lecture_id, time_checkin FROM FaceRecognition")
    result = cursor.fetchall()
    conn.close()
    return [
        FaceRecognition(
            id=row[0],
            ten=row[1],
            user_id=row[2],
            lecture_id=row[3],
            time_checkin=row[4]
        ) for row in result
    ]

# Thêm bản ghi mới
@app.post("/faces/", response_model=FaceRecognition)
def create_face(face: FaceRecognition):
    conn = get_connection()
    cursor = conn.cursor()
    if face.time_checkin is None:
        # Nếu client không gửi time_checkin, để DB tự set default CURRENT_TIMESTAMP
        cursor.execute(
            "INSERT INTO FaceRecognition (ten, user_id, lecture_id) VALUES (%s, %s, %s)",
            (face.ten, face.user_id, face.lecture_id)
        )
    else:
        cursor.execute(
            "INSERT INTO FaceRecognition (ten, user_id, lecture_id, time_checkin) VALUES (%s, %s, %s, %s)",
            (face.ten, face.user_id, face.lecture_id, face.time_checkin)
        )
    conn.commit()
    face.id = cursor.lastrowid
    if face.time_checkin is None:
        # Lấy lại giá trị time_checkin từ DB nếu cần
        cursor.execute("SELECT time_checkin FROM FaceRecognition WHERE id = %s", (face.id,))
        face.time_checkin = cursor.fetchone()[0]
    conn.close()
    return face

# Lấy bản ghi theo id
@app.get("/faces/{face_id}", response_model=FaceRecognition)
def get_face(face_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, ten, user_id, lecture_id, time_checkin FROM FaceRecognition WHERE id = %s",
        (face_id,)
    )
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Face record not found")
    return FaceRecognition(
        id=row[0], ten=row[1], user_id=row[2], lecture_id=row[3], time_checkin=row[4]
    )

# Cập nhật bản ghi
@app.put("/faces/{face_id}", response_model=FaceRecognition)
def update_face(face_id: int, face: FaceRecognition):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE FaceRecognition SET ten = %s, user_id = %s, lecture_id = %s, time_checkin = %s WHERE id = %s",
        (face.ten, face.user_id, face.lecture_id, face.time_checkin, face_id)
    )
    conn.commit()
    conn.close()
    face.id = face_id
    return face

# Xóa bản ghi
@app.delete("/faces/{face_id}", response_model=FaceRecognition)
def delete_face(face_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, ten, user_id, lecture_id, time_checkin FROM FaceRecognition WHERE id = %s",
        (face_id,)
    )
    row = cursor.fetchone()
    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Face record not found")
    cursor.execute("DELETE FROM FaceRecognition WHERE id = %s", (face_id,))
    conn.commit()
    conn.close()
    return FaceRecognition(
        id=row[0], ten=row[1], user_id=row[2], lecture_id=row[3], time_checkin=row[4]
    )
