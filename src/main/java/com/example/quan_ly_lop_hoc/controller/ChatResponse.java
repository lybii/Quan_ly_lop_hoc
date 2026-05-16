package com.example.quan_ly_lop_hoc.controller;

public class ChatResponse {
    private String type;
    private String response;

    public ChatResponse(String type, String response) {
        this.type = type;
        this.response = response;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}