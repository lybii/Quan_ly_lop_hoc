package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotNull;

public class MarkAttendanceRequest {

    @NotNull(message = "Time is required")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date time;

    @NotNull(message = "Status is required")
    private Integer status;

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Lecture ID is required")
    private Integer lectureId;

    // Constructors
    public MarkAttendanceRequest() {}

    public MarkAttendanceRequest(Date time, Integer status, Integer userId, Integer lectureId) {
        this.time = time;
        this.status = status;
        this.userId = userId;
        this.lectureId = lectureId;
    }

    // Getters and Setters
    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getLectureId() {
        return lectureId;
    }

    public void setLectureId(Integer lectureId) {
        this.lectureId = lectureId;
    }
}
