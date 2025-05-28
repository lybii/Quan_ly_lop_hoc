import mysql.connector
from datetime import datetime

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="quanlylophoc"
    )

def init_db():
    conn = get_connection()
    c = conn.cursor()

    # Tạo bảng FaceRecognition lưu thông tin nhận diện, thêm cột thời gian điểm danh
    c.execute('''
        CREATE TABLE IF NOT EXISTS FaceRecognition (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ten VARCHAR(255) NOT NULL,
            user_id INT NOT NULL,
            lecture_id INT NOT NULL,
            time_checkin DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id),
            FOREIGN KEY (lecture_id) REFERENCES lecture(id)
        )
    ''')

    conn.commit()
    conn.close()

def add_face_recognition(ten, user_id, lecture_id, time_checkin=None):
    try:
        conn = get_connection()
        c = conn.cursor()
        if time_checkin is None:
            # Nếu không truyền thời gian, sử dụng thời gian hiện tại
            c.execute('INSERT INTO FaceRecognition (ten, user_id, lecture_id) VALUES (%s, %s, %s)', (ten, user_id, lecture_id))
        else:
            # Nếu truyền thời gian thì thêm vào
            c.execute('INSERT INTO FaceRecognition (ten, user_id, lecture_id, time_checkin) VALUES (%s, %s, %s, %s)', (ten, user_id, lecture_id, time_checkin))
        conn.commit()
    except mysql.connector.IntegrityError as e:
        print(f"Error: {e}")
    finally:
        conn.close()

init_db()
