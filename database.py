import mysql.connector
from datetime import datetime

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="quanlylophoc"
    )
"""
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
            print(f"Inserting: ten={ten}, user_id={user_id}, lecture_id={lecture_id}")
            c.execute('INSERT INTO FaceRecognition (ten, user_id, lecture_id) VALUES (%s, %s, %s)', (ten, user_id, lecture_id))
        else:
            print(f"Inserting with time_checkin: ten={ten}, user_id={user_id}, lecture_id={lecture_id}, time_checkin={time_checkin}")
            c.execute('INSERT INTO FaceRecognition (ten, user_id, lecture_id, time_checkin) VALUES (%s, %s, %s, %s)', (ten, user_id, lecture_id, time_checkin))
        conn.commit()
        print("Insert committed successfully")
    except mysql.connector.IntegrityError as e:
        print(f"Integrity Error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
"""
def init_db():
    conn = get_connection()
    c = conn.cursor()

    # Tạo bảng FaceRecognition với cột status (0: chưa điểm danh, 1: đã điểm danh)
    c.execute('''
        CREATE TABLE IF NOT EXISTS FaceRecognition (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ten VARCHAR(255) NOT NULL,
            user_id INT NOT NULL,
            lecture_id INT NOT NULL,
            time_checkin DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status TINYINT(1) NOT NULL DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES user(id),
            FOREIGN KEY (lecture_id) REFERENCES lecture(id)
        )
    ''')

    # Thêm cột status nếu chưa có (trường hợp bảng đã tồn tại)
    try:
        c.execute("ALTER TABLE FaceRecognition ADD COLUMN status TINYINT(1) NOT NULL DEFAULT 0")
    except mysql.connector.errors.ProgrammingError:
        pass  # Cột đã tồn tại, không cần thêm nữa

    conn.commit()
    conn.close()

def add_face_recognition(ten, user_id, lecture_id, time_checkin=None):
    try:
        conn = get_connection()
        c = conn.cursor()
        if time_checkin is None:
            print(f"Inserting: ten={ten}, user_id={user_id}, lecture_id={lecture_id}")
            c.execute('''
                INSERT INTO FaceRecognition (ten, user_id, lecture_id, status)
                VALUES (%s, %s, %s, %s)
            ''', (ten, user_id, lecture_id, 1))
        else:
            print(f"Inserting with time_checkin: ten={ten}, user_id={user_id}, lecture_id={lecture_id}, time_checkin={time_checkin}")
            c.execute('''
                INSERT INTO FaceRecognition (ten, user_id, lecture_id, time_checkin, status)
                VALUES (%s, %s, %s, %s, %s)
            ''', (ten, user_id, lecture_id, time_checkin, 1))
        conn.commit()
        print("Insert committed successfully")
    except mysql.connector.IntegrityError as e:
        print(f"Integrity Error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

"""        
def get_user_ids_by_lecture_id(lecture_id):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT user_id FROM lecture_user WHERE lecture_id = %s", (lecture_id,))
    results = [row[0] for row in c.fetchall()]
    conn.close()
    return results
"""

def get_user_ids_by_lecture_id(lecture_id):
    conn = get_connection()
    c = conn.cursor()
    
    # Lấy class_id từ lecture
    c.execute("SELECT class_id FROM lecture WHERE id = %s", (lecture_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return []  # Không tìm thấy lecture
    
    class_id = row[0]

    # Lấy user_id từ class_user thông qua class_id
    c.execute("SELECT user_id FROM class_user WHERE class_id = %s", (class_id,))
    results = [r[0] for r in c.fetchall()]
    
    conn.close()
    return results


def get_checked_in_users_by_lecture_id(lecture_id):
    conn = get_connection()
    c = conn.cursor(dictionary=True)
    query = """
        SELECT fr.ten, fr.user_id, fr.lecture_id, fr.time_checkin
        FROM FaceRecognition fr
        INNER JOIN (
            SELECT user_id, MAX(time_checkin) AS max_checkin
            FROM FaceRecognition
            WHERE lecture_id = %s
            GROUP BY user_id
        ) latest ON fr.user_id = latest.user_id AND fr.time_checkin = latest.max_checkin
        WHERE fr.lecture_id = %s
        ORDER BY fr.time_checkin DESC
    """
    c.execute(query, (lecture_id, lecture_id))
    results = c.fetchall()
    conn.close()
    return results



init_db()
