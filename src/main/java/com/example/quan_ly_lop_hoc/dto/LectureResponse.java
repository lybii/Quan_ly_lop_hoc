package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

public class LectureResponse {
    private int id;
    private String title;
    private String description;
    private String file;
    private Date startTime;
    private Date endTime;
    private Integer status;
    private Integer classId;

    // Constructor không tham số
    public LectureResponse() {}

    // Constructor với tham số
    public LectureResponse(int id, String title, String description, String file,
                        Date startTime, Date endTime, Integer status, Integer classId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.file = file;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.classId = classId;
    }

    // Getter và Setter cho id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter và Setter cho title
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // Getter và Setter cho description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Getter và Setter cho file
    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    // Getter và Setter cho startTime
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    // Getter và Setter cho endTime
    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    // Getter và Setter cho status
    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    // Getter và Setter cho classId
    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }
}
