package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

public class SubmissionResponse {

    private int id;
    private String file;
    private Date submissionTime;
    private int status;
    private Float grade;
    private Integer userId;
    private Integer assignmentId;

    public SubmissionResponse() {}

    public SubmissionResponse(int id, String file, Date submissionTime, int status, Float grade, Integer userId, Integer assignmentId) {
        this.id = id;
        this.file = file;
        this.submissionTime = submissionTime;
        this.status = status;
        this.grade = grade;
        this.userId = userId;
        this.assignmentId = assignmentId;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Date getSubmissionTime() {
        return submissionTime;
    }

    public void setSubmissionTime(Date submissionTime) {
        this.submissionTime = submissionTime;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Float getGrade() {
        return grade;
    }

    public void setGrade(Float grade) {
        this.grade = grade;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Integer assignmentId) {
        this.assignmentId = assignmentId;
    }
}
