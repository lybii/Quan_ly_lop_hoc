import os
import math
import cv2
import numpy as np
from datetime import datetime
import face_recognition
from database import (
    add_face_recognition,
    get_user_ids_by_lecture_id,
)

class FaceRecognitionByLecture:
    def __init__(self, lecture_id, face_match_threshold=0.5):
        self.lecture_id = lecture_id
        self.face_match_threshold = face_match_threshold
        self.known_face_encodings = []
        self.known_face_names = []
        self.face_locations = []
        self.face_encodings = []
        self.face_names = []
        self.already_checked_in = set()
        self.allowed_user_ids = set(get_user_ids_by_lecture_id(lecture_id))
        self.checked_in_users = []
        self.load_known_faces()

    def load_known_faces(self):
        os.makedirs('static/faces_realtime', exist_ok=True)
        for file in os.listdir('static/faces_realtime'):
            if file.startswith('.') or not file.endswith(('.jpg', '.png')):
                continue
            name = os.path.splitext(file)[0]
            try:
                ten, user_id_str = name.split('-')
                user_id = int(user_id_str)
            except ValueError:
                continue

            if user_id in self.allowed_user_ids:
                path = os.path.join('static/faces_realtime', file)
                image = face_recognition.load_image_file(path)
                encodings = face_recognition.face_encodings(image)
                if encodings:
                    self.known_face_encodings.append(encodings[0])
                    self.known_face_names.append(name)

    def face_confidence(self, face_distance):
        if face_distance > self.face_match_threshold:
            return "0%"
        range_val = 1.0 - self.face_match_threshold
        linear_val = (1.0 - face_distance) / (range_val * 2.0)
        confidence = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
        return f"{round(confidence, 2)}%"

    def run_with_live_camera(self):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise RuntimeError("Cannot open camera")

        self.checked_in_users = []  # Reset mỗi lần chạy
        known_faces_seen = set()    # Tránh nhận diện nhầm lặp lại

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

            self.face_locations = face_recognition.face_locations(rgb_small_frame)
            self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

            for face_encoding, face_location in zip(self.face_encodings, self.face_locations):
                name_display = "Unknown (0%)"

                matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=self.face_match_threshold)
                face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                best_index = np.argmin(face_distances) if face_distances.size > 0 else -1

                if best_index != -1 and matches[best_index]:
                    name_raw = self.known_face_names[best_index]
                    try:
                        ten, user_id_str = name_raw.split('-')
                        user_id = int(user_id_str)
                    except:
                        continue

                    if user_id in self.allowed_user_ids and user_id not in self.already_checked_in:
                        # ✅ Ghi nhận
                        add_face_recognition(ten, user_id, self.lecture_id)
                        self.already_checked_in.add(user_id)
                        known_faces_seen.add(user_id)

                        self.checked_in_users.append({
                            "ten": ten,
                            "user_id": user_id,
                            "lecture_id": self.lecture_id,
                            "time_checkin": datetime.now().isoformat()
                        })

                    confidence = self.face_confidence(face_distances[best_index])
                    name_display = f"{ten} ({confidence})"
                else:
                    name_display = "Unknown (0%)"

                # Hiển thị khung
                top, right, bottom, left = [v * 4 for v in face_location]
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, name_display, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

            cv2.imshow('Face Recognition - Press q to quit', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
