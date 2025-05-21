# Quan Ly Lop Hoc (Classroom Management System)

## Recent Fixes

### 1. Fixed Avatar Upload Issues
- Implemented Cloudinary unsigned upload for profile images
- Simplified the upload process using direct fetch API
- Removed dependency on API keys for authentication
- Added better error handling for upload failures
- Implemented consistent avatar upload functionality across student and teacher profiles

### 2. Fixed API Error Handling
- Enhanced error handling for schedule data API calls
- Added fallback for failed schedule API calls to prevent application crashes
- Improved validation of API response data to handle unexpected data formats

### 3. Improved Profile Management
- Implemented full profile update functionality for both students and teachers
- Added proper form validation and error reporting
- Fixed issues with saving profile information updates
- Added preview functionality for avatar changes before confirming upload

## Setup and Running

### Prerequisites
- Node.js and npm
- Java 11+ for the backend server
- MySQL or PostgreSQL database

### Starting the frontend
```bash
npm install
npm run dev
```

### Starting the backend
```bash
cd database
./mvnw spring-boot:run
```

## Features
- User authentication with role-based access (Student, Lecturer, Admin)
- Class management for teachers
- Course enrollment for students
- Assignment creation and submission
- Student attendance tracking
- Profile management with avatar customization
- Class schedule viewing

## Tech Stack
- Frontend: React, TypeScript, TailwindCSS
- Backend: Spring Boot, Java
- Database: MySQL/PostgreSQL
- Image Hosting: Cloudinary (using unsigned upload)
