package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public class SubmissionRequest {

    @NotBlank(message = "File is required")
    private String file;

    @NotNull(message = "Submission time is required")
    @PastOrPresent(message = "Submission time must be in the past or present")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date submissionTime;

    @NotNull(message = "Status is required")
    private Integer status;

    private Float grade;

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Assignment ID is required")
    private Integer assignmentId;

    public SubmissionRequest() {}

    public SubmissionRequest(String file, Date submissionTime, Integer status, Float grade, Integer userId, Integer assignmentId) {
        this.file = file;
        this.submissionTime = submissionTime;
        this.status = status;
        this.grade = grade;
        this.userId = userId;
        this.assignmentId = assignmentId;
    }

    // Getters and Setters
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
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

