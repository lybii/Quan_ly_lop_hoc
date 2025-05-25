package com.example.quan_ly_lop_hoc.dto;

public class FileLectureResponse {

    private Integer id;
    private String file;
    private Integer status;
    private Integer lectureId;

    public FileLectureResponse() {}

    public FileLectureResponse(Integer id, String file, Integer status, Integer lectureId) {
        this.id = id;
        this.file = file;
        this.status = status;
        this.lectureId = lectureId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getLectureId() {
        return lectureId;
    }

    public void setLectureId(Integer lectureId) {
        this.lectureId = lectureId;
    }
}
