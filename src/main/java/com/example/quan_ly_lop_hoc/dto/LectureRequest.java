package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public class LectureRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "File is required")
    private String file;

    @NotNull(message = "Start time is required")
    @PastOrPresent(message = "Start time must be in the past or present")
    private Date startTime;

    @NotNull(message = "End time is required")
    @FutureOrPresent(message = "End time must be in the future or present")
    private Date endTime;

    @NotNull(message = "Status is required")
    private Integer status;

    @NotNull(message = "Class ID is required")
    private Integer classId;

    // Default constructor
    public LectureRequest() {}

    // All-args constructor
    public LectureRequest(String title, String description, String file, Date startTime, Date endTime, Integer status, Integer classId) {
        this.title = title;
        this.description = description;
        this.file = file;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.classId = classId;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }
}
