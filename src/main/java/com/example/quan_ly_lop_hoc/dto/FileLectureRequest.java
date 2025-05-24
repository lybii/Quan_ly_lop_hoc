package com.example.quan_ly_lop_hoc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FileLectureRequest {

    @NotBlank(message = "File is required")
    private String file;

    @NotNull(message = "Status is required")
    private Integer status;

    @NotNull(message = "Lecture ID is required")
    private Integer lectureId;

    public FileLectureRequest() {}

    public FileLectureRequest(String file, Integer status, Integer lectureId) {
        this.file = file;
        this.status = status;
        this.lectureId = lectureId;
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
