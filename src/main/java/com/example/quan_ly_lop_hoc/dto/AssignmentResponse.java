package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;
//import java.util.List;

public class AssignmentResponse {
    private int id;
    private String title;
    private String description;
    private Date time;
    private Date deadline;
    private String file;
    private Integer status;
    private Integer classId;
    //private List<SubmissionResponse> submissions;

    // Constructors
    public AssignmentResponse() {
    }

    public AssignmentResponse(int id, String title, String description, Date time, Date deadline,
                            String file, Integer status, Integer classId) {//List<SubmissionResponse> submissions
        this.id = id;
        this.title = title;
        this.description = description;
        this.time = time;
        this.deadline = deadline;
        this.file = file;
        this.status = status;
        this.classId = classId;
        //this.submissions = submissions;
    }

    //Getters & Setters
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

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getClassId() {
        return classId;
    }
    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    /*public List<SubmissionResponse> getSubmissions() {
        return submissions;
    }
    public void setSubmissions(List<SubmissionResponse> submissions) {
        this.submissions = submissions;
    }*/
}
