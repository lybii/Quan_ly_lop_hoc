
import os
import sys
import math
import cv2
import numpy as np
import face_recognition
from database import add_face_recognition  # Thêm dòng này để gọi hàm ghi CSDL


class FaceRecognitionRealTime:
    def __init__(self, face_match_threshold=0.5):
        self.face_locations = []
        self.face_encodings = []
        self.face_names = []
        self.known_face_encodings = []
        self.known_face_names = []
        self.process_current_frame = True
        self.face_match_threshold = face_match_threshold
        self.encode_faces()
        self.already_checked_in = set()  # Để tránh điểm danh trùng

    def encode_faces(self):
        os.makedirs('static/faces_realtime', exist_ok=True)
        for image_name in os.listdir('static/faces_realtime'):
            if image_name.startswith('.'):
                continue
            image_path = os.path.join('static/faces_realtime', image_name)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            if encodings:
                self.known_face_encodings.append(encodings[0])
                self.known_face_names.append(os.path.splitext(image_name)[0])

    def face_confidence(self, face_distance):
        if face_distance > self.face_match_threshold:
            return "0%"
        else:
            range_val = (1.0 - self.face_match_threshold)
            linear_val = (1.0 - face_distance) / (range_val * 2.0)
            confidence = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
            return f"{round(confidence, 2)}%"

    def run_recognition_realtime(self):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            sys.exit("Cannot open camera")

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame")
                break

            frame = cv2.flip(frame, 1)

            if self.process_current_frame:
                small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

                self.face_locations = face_recognition.face_locations(rgb_small_frame)
                self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

                self.face_names = []
                for face_encoding in self.face_encodings:
                    if not self.known_face_encodings:
                        self.face_names.append("unknown (0%)")
                        continue

                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)
                    best_distance = face_distances[best_match_index]

                    if best_distance <= self.face_match_threshold:
                        name_raw = self.known_face_names[best_match_index]
                        confidence = self.face_confidence(best_distance)

                        try:
                            ten, user_id_str, lecture_id_str = name_raw.split('-')
                            user_id = int(user_id_str)
                            lecture_id = int(lecture_id_str)
                            name_display = f"{ten} ({confidence})"
                            self.face_names.append(name_display)

                            key = (user_id, lecture_id)
                            if key not in self.already_checked_in:
                                add_face_recognition(ten, user_id, lecture_id)
                                self.already_checked_in.add(key)
                        except ValueError:
                            self.face_names.append("FormatError (0%)")
                    else:
                        self.face_names.append("unknown (0%)")

            self.process_current_frame = not self.process_current_frame

            for (top, right, bottom, left), name in zip(self.face_locations, self.face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                cv2.putText(frame, name, (left + 6, bottom - 6),
                            cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)

            cv2.imshow('Face Recognition (Press "Q" to exit)', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
"""
def run_once_and_return_result(app=None, max_attempts=100, show_window=False):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return {"status": "error", "message": "Cannot open camera"}

    if app is None:
        app = FaceRecognitionRealTime()

    result = []
    attempts = 0

    while attempts < max_attempts:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for face_encoding in face_encodings:
            face_distances = face_recognition.face_distance(app.known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            best_distance = face_distances[best_match_index]

            if best_distance <= app.face_match_threshold:
                try:
                    name_raw = app.known_face_names[best_match_index]
                    ten, user_id_str, lecture_id_str = name_raw.split('-')
                    user_id = int(user_id_str)
                    lecture_id = int(lecture_id_str)

                    key = (user_id, lecture_id)
                    if key not in app.already_checked_in:
                        add_face_recognition(ten, user_id, lecture_id)
                        app.already_checked_in.add(key)

                    cap.release()
                    cv2.destroyAllWindows()
                    return {
                        "status": "success",
                        "ten": ten,
                        "user_id": user_id,
                        "lecture_id": lecture_id
                    }
                except Exception as e:
                    return {"status": "error", "message": str(e)}

        if show_window:
            cv2.imshow("Checking...", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        attempts += 1

    cap.release()
    cv2.destroyAllWindows()
    return {"status": "not_found", "message": "Không nhận diện được khuôn mặt"}
"""

def run_once_and_return_result(app=None, show_window=True):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return {"status": "error", "message": "Cannot open camera"}

    if app is None:
        app = FaceRecognitionRealTime()

    detected_people = set()  # lưu người đã nhận diện trong phiên

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)

        # Giảm kích thước và chuyển sang RGB để nhận diện
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for face_encoding in face_encodings:
            if not app.known_face_encodings:
                continue  # nếu chưa có face để so sánh thì bỏ qua

            face_distances = face_recognition.face_distance(app.known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            best_distance = face_distances[best_match_index]

            if best_distance <= app.face_match_threshold:
                try:
                    name_raw = app.known_face_names[best_match_index]
                    ten, user_id_str, lecture_id_str = name_raw.split('-')
                    user_id = int(user_id_str)
                    lecture_id = int(lecture_id_str)

                    key = (user_id, lecture_id)
                    if key not in app.already_checked_in:
                        add_face_recognition(ten, user_id, lecture_id)
                        app.already_checked_in.add(key)
                        detected_people.add((ten, user_id, lecture_id))
                except Exception:
                    # Nếu lỗi, bỏ qua khuôn mặt này
                    pass

        # Hiển thị camera và khuôn mặt nếu yêu cầu
        if show_window:
            # Vẽ hộp quanh mặt
            for (top, right, bottom, left) in face_locations:
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

            # Ghi tên từng khuôn mặt
            face_names = []
            for face_encoding in face_encodings:
                if not app.known_face_encodings:
                    face_names.append("unknown (0%)")
                    continue

                face_distances = face_recognition.face_distance(app.known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                best_distance = face_distances[best_match_index]

                if best_distance <= app.face_match_threshold:
                    name_raw = app.known_face_names[best_match_index]
                    confidence = app.face_confidence(best_distance)
                    try:
                        ten, _, _ = name_raw.split('-')
                        face_names.append(f"{ten} ({confidence})")
                    except:
                        face_names.append("FormatError (0%)")
                else:
                    face_names.append("unknown (0%)")

            for ((top, right, bottom, left), name) in zip(face_locations, face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                cv2.putText(frame, name, (left + 6, bottom - 6),
                            cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)

            cv2.imshow("Face Recognition (Press Q to quit)", frame)

            # Dừng vòng lặp nếu nhấn 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

    if detected_people:
        return {
            "status": "success",
            "detected": [{"ten": ten, "user_id": uid, "lecture_id": lid} for (ten, uid, lid) in detected_people]
        }
    else:
        return {"status": "not_found", "message": "Không nhận diện được khuôn mặt"}


if __name__ == "__main__":
    app = FaceRecognitionRealTime()
    app.run_recognition_realtime()
