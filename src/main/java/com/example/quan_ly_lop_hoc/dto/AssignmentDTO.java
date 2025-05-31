package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

public class AssignmentDTO {
    private int id;
    private String title;
    private String description;
    private Date time;
    private Date deadline;
    private String file;
    private int status;
    private ClassDTO class1;

    public AssignmentDTO() {
    }

    public AssignmentDTO(int id, String title, String description, Date time, Date deadline, String file, int status, ClassDTO class1) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.time = time;
        this.deadline = deadline;
        this.file = file;
        this.status = status;
        this.class1 = class1;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public ClassDTO getClass1() {
        return class1;
    }

    public void setClass1(ClassDTO class1) {
        this.class1 = class1;
    }
}