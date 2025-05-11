package com.example.quan_ly_lop_hoc.model;

public class ResponseObject {

    private int status;
    private String desc;
    private Object data;
    private boolean success;

    public ResponseObject() {}

    public ResponseObject(int status, String desc, Object data, boolean success) {
        this.status = status;
        this.desc = desc;
        this.data = data;
        this.success = success;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}