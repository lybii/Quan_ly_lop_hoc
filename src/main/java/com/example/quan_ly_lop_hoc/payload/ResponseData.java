package com.example.quan_ly_lop_hoc.payload;


public class ResponseData {
    private int status = 200;
    private boolean isSuccess = true;
    private String desc;
    private Object data;

    public ResponseData(){
        
    }

    public ResponseData(int status, boolean isSuccess, String desc, Object data){
        this.status = status;
        this.isSuccess = isSuccess;
        this.desc = desc;
        this.data = data;
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
        return isSuccess;
    }
    public void setSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }


}