package com.example.quan_ly_lop_hoc.payload.request;

public class CommentRequest {
    private Integer userId;
    private Integer assignmentId;
    private String content;

    public CommentRequest() {}

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}