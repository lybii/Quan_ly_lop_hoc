package com.example.quan_ly_lop_hoc.dto;

import java.util.List;

public class CourseDTO {
    private int id;
    private String courseName;
    private String description;
    private String courseCode;
    private int credits;
    private int status;
    private List<ClassDTO> classes; // Danh sách lớp học (dùng khi cần)

    // Constructor mặc định
    public CourseDTO() {
    }

    // Constructor đầy đủ
    public CourseDTO(int id, String courseName, String description, String courseCode, int credits, int status, List<ClassDTO> classes) {
        this.id = id;
        this.courseName = courseName;
        this.description = description;
        this.courseCode = courseCode;
        this.credits = credits;
        this.status = status;
        this.classes = classes;
    }

    // Getters và Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public List<ClassDTO> getClasses() {
        return classes;
    }

    public void setClasses(List<ClassDTO> classes) {
        this.classes = classes;
    }
}