package com.example.quan_ly_lop_hoc.dto;

import java.util.List;

public class ClassDetailDTO {
    private int id;
    private String classCode;
    private String type;
    private int count;
    private int status;
    private CourseDTO course;
    private List<ClassUserDTO> lecturers; // Danh sách giảng viên
    private List<ClassUserDTO> students; // Danh sách sinh viên

    public ClassDetailDTO() {
    }

    public ClassDetailDTO(int id, String classCode, String type, int count, int status, 
                         CourseDTO course, List<ClassUserDTO> lecturers, List<ClassUserDTO> students) {
        this.id = id;
        this.classCode = classCode;
        this.type = type;
        this.count = count;
        this.status = status;
        this.course = course;
        this.lecturers = lecturers;
        this.students = students;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public List<ClassUserDTO> getLecturers() {
        return lecturers;
    }

    public void setLecturers(List<ClassUserDTO> lecturers) {
        this.lecturers = lecturers;
    }

    public List<ClassUserDTO> getStudents() {
        return students;
    }

    public void setStudents(List<ClassUserDTO> students) {
        this.students = students;
    }
}