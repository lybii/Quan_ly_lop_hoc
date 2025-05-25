package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public class AssignmentRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Start time is required")
    @PastOrPresent(message = "Start time must be in the past or present")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date time;

    @NotNull(message = "Deadline is required")
    @FutureOrPresent(message = "Deadline must be in the future or present")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date deadline;

    @NotBlank(message = "File is required")
    private String file;

    @NotNull(message = "Status is required")
    private Integer status;

    @NotNull(message = "Class ID is required")
    private Integer classId;


    // Constructors
    public AssignmentRequest() {
    }

    public AssignmentRequest(String title, String description, Date time, Date deadline,
                            String file, Integer status, Integer classId) {
        this.title = title;
        this.description = description;
        this.time = time;
        this.deadline = deadline;
        this.file = file;
        this.status = status;
        this.classId = classId;
    }

    // Getters & Setter
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

    public Date getTime() {
        return time;
    }
    public void setTime(Date time) {
        this.time = time;
    }

    public Date getDeadline() {
        return deadline;
    }
    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public String getFile() {
        return file;
    }
    public void setFile(String file) {
        this.file = file;
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
