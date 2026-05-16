package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

public class NotificationResponse {

    private int id;
    private String title;
    private String content;
    private int status;
    private int userId;
    private Date time;

    public NotificationResponse() {}

    public NotificationResponse(int id, String title, String content, int status, int userId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.status = status;
        this.userId = userId;
    }

    public NotificationResponse(int id, String title, String content, int status, int userId, Date time) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.status = status;
        this.userId = userId;
        this.time = time;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
