package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

public class LectureDTO {
    private int id;
    private String title;
    private String description;
    private String file;
    private Date startTime;
    private Date endTime;
    private int status;
    private int classId;

    public LectureDTO() {}

    public LectureDTO(int id, String title, String description, String file, Date startTime, Date endTime, int status, int classId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.file = file;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.classId = classId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getClassId() {
        return classId;
    }

    public void setClassId(int classId) {
        this.classId = classId;
    }
}