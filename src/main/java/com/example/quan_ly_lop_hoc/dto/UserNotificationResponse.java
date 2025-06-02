package com.example.quan_ly_lop_hoc.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class UserNotificationResponse {

    private int id;

    private int notificationId;

    private int userId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date time;

    public UserNotificationResponse() {}

    public UserNotificationResponse(int id, int notificationId, int userId, Date time) {
        this.id = id;
        this.notificationId = notificationId;
        this.userId = userId;
        this.time = time;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
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