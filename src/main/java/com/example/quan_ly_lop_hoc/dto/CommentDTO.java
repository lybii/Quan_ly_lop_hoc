package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

public class CommentDTO {
    private int id;
    private String content;
    private Date time;
    private String userName;

    public CommentDTO() {}

    public CommentDTO(int id, String content, Date time, String userName) {
        this.id = id;
        this.content = content;
        this.time = time;
        this.userName = userName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}