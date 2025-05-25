package com.example.quan_ly_lop_hoc.dto;

import java.util.List;

public class ClassDTO {
    private int id;
    private String classCode;
    private String type;
    private int count;
    private int status;
    private int courseId;
    private int classUserId; // ID của giảng viên

    private List<Integer> studentIds; // Danh sách ID của sinh viên
    public ClassDTO() {
    }

    public ClassDTO(int id, String classCode, String type, int count, int status, int courseId, int classUserId) {
        this.id = id;
        this.classCode = classCode;
        this.type = type;
        this.count = count;
        this.status = status;
        this.courseId = courseId;
        this.classUserId = classUserId;
    }

    // Getters và Setters
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

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public int getClassUserId() {
        return classUserId;
    }

    public void setClassUserId(int classUserId) {
        this.classUserId = classUserId;
    }
    public List<Integer> getStudentIds() { 
        return studentIds; 
    }
    public void setStudentIds(List<Integer> studentIds) { 
        this.studentIds = studentIds; 
    }
}
