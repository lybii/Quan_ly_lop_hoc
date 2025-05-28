
import os
import sys
import cv2
import numpy as np
import face_recognition
import math
import matplotlib.pyplot as plt
import time
from database import add_face_recognition
from datetime import datetime 

class FaceRecognition:
    def __init__(self):
        self.face_locations = [] 
        self.face_encodings = []
        self.face_names = []
        self.known_face_encodings = []
        self.known_face_names = []
        self.process_current_frame = True
        self.encode_faces()

    def encode_faces(self):
        for image in os.listdir('static/faces'):
            if image == '.DS_Store':
                continue
            face_image = face_recognition.load_image_file(f'static/faces/{image}')
            face_encoding = face_recognition.face_encodings(face_image)[0]
            self.known_face_encodings.append(face_encoding)
            self.known_face_names.append(image.split('.')[0])

    def face_confidence(self, face_distance, face_match_threshold=0.6):
        range_var = (1.0 - face_match_threshold)
        linear_val = (1.0 - face_distance) / (range_var * 2.0)

        if face_distance > face_match_threshold: 
            return f"{round(linear_val * 100, 2)}%"
        else:
            value = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
            return f"{round(value, 2)}%"

    def prompt_ready(self):
        response = input("Welcome to the attendance system, are you ready to be scanned? (yes/no): ").strip().lower()
        return response == 'yes'

    def run_recognition(self):
        video_capture = cv2.VideoCapture(0)

        if not video_capture.isOpened():
            sys.exit('Video not found')

        recognized = False
        last_frame = None
        start_time = time.time()

        while not recognized and (time.time() - start_time) < 5: 
            print("Scanning in process, please wait...")  
            ret, frame = video_capture.read()
            if not ret:
                break

            if self.process_current_frame:
                small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
                self.face_locations = face_recognition.face_locations(rgb_small_frame)
                self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

                self.face_names = []
                for face_encoding in self.face_encodings:
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    name = 'unknown'
                    confidence = 'unknown'

                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)

                    if matches[best_match_index]:
                        name = self.known_face_names[best_match_index]
                        confidence = self.face_confidence(face_distances[best_match_index])
                        if float(confidence[:-1]) > 95.0:
                            recognized = True

                    self.face_names.append(f'{name} ({confidence})')
            
            self.process_current_frame = not self.process_current_frame

            if recognized:
                last_frame = frame.copy()
                break

        video_capture.release()
        cv2.destroyAllWindows() 

        if last_frame is not None:
            self.plot_recognized_face(last_frame)

        return recognized

    def plot_recognized_face(self, frame):
        for (top, right, bottom, left), name in zip(self.face_locations, self.face_names):
            top *= 4
            right *= 4 
            bottom *= 4
            left *= 4

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 4)
            cv2.rectangle(frame, (left, bottom - 50), (right, bottom), (0, 0, 255), -2)
            cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 2, (255, 255, 255), 1)

            face_landmarks_list = face_recognition.face_landmarks(frame)
            for face_landmarks in face_landmarks_list:
                for facial_feature in face_landmarks.keys():
                    for point in face_landmarks[facial_feature]:
                        cv2.circle(frame, point, 2, (0, 255, 255), -1)

        plt.figure(figsize=(10, 10))
        plt.imshow(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        plt.title("Recognized Face")
        plt.axis('off')
        plt.show()

        self.plot_color_histogram(frame)

    def plot_color_histogram(self, frame):
        color = ('b', 'g', 'r')
        plt.figure(figsize=(10, 5)) 
        for i, col in enumerate(color): 
            hist = cv2.calcHist([frame], [i], None, [256], [0, 256])
            plt.plot(hist, color=col)
            plt.xlim([0, 256])
        plt.title("Histogram for color scale picture")
        plt.show()

    def take_selfie(self, your_name):
        print("Please get ready to take a selfie to register your face in the system.")
        video_capture = cv2.VideoCapture(0)
        if not video_capture.isOpened():
            sys.exit('Video not found')

        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            cv2.imshow('Press "S" to take a Selfie and Exit', frame)
            if cv2.waitKey(1) & 0xFF == ord('s'):
                cv2.imwrite(f'static/faces/{your_name}.png', frame)
                cv2.destroyAllWindows()
                break

        video_capture.release()
        plt.figure(figsize=(10, 10))
        plt.imshow(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        plt.title(f"{your_name}")
        plt.axis('off')
        plt.show()

        self.encode_faces()

class AttendanceSystem:
    def __init__(self):
        self.face_recognition = FaceRecognition()
        self.user_name = ""

    def start(self):
        self.user_name = input("Please enter your name: ").strip()
        if not self.face_recognition.prompt_ready():
            print("Exiting the system.")
            return
        self.scan_and_check_in()
"""
    def scan_and_check_in(self):
        recognized = self.face_recognition.run_recognition()
        if recognized:
            print("Attendance recorded successfully.")
            add_attendance(self.user_name) # record attendance to database
        else:
            response = input("Your face is not in the database. Do you want to register? (yes/no): ").strip().lower()
            if response == 'yes':
                self.face_recognition.take_selfie(self.user_name)
                print(f"Your face has been registered, {self.user_name}. You can now check in.")
                regist_user(self.user_name) # regist to database
                response = input("Do you want to check in now? (yes/no): ").strip().lower()
                if response == 'yes':
                    self.scan_and_check_in()
            else:
                print("Exiting the system.")
"""
if __name__ == "__main__":
    system = AttendanceSystem()
    system.start()
