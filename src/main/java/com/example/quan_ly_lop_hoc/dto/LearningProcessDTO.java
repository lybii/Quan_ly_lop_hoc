package com.example.quan_ly_lop_hoc.dto;

public class LearningProcessDTO {
    private int classId;
    private String classCode;
    private String courseName;
    private String courseCode;
    private int completionPercentage; // Phần trăm hoàn thành (giả định)

    public LearningProcessDTO() {
    }

    public LearningProcessDTO(int classId, String classCode, String courseName, String courseCode, int completionPercentage) {
        this.classId = classId;
        this.classCode = classCode;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.completionPercentage = completionPercentage;
    }

    // Getters và Setters
    public int getClassId() {
        return classId;
    }

    public void setClassId(int classId) {
        this.classId = classId;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}