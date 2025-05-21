package com.example.quan_ly_lop_hoc.dto;

public class GradeDTO {
    private int submissionId;
    private int courseId;
    private String courseName;
    private Float grade;

    public GradeDTO() {}

    public GradeDTO(int submissionId, int courseId, String courseName, Float grade) {
        this.submissionId = submissionId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.grade = grade;
    }

    public int getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(int submissionId) {
        this.submissionId = submissionId;
    }

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Float getGrade() {
        return grade;
    }

    public void setGrade(Float grade) {
        this.grade = grade;
    }
}