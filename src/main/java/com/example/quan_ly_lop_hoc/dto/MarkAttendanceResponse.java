package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;
import com.example.quan_ly_lop_hoc.dto.UserDTO;
import com.example.quan_ly_lop_hoc.dto.LectureResponse;

public class MarkAttendanceResponse {

    private int id;
    private Date time;
    private int status;
    private int userId;
    private String userName;
    private int lectureId;
    private String lectureTitle;

    // ➕ Thêm 2 đối tượng mới
    private UserDTO user;
    private LectureResponse lecture;

    // Constructors
    public MarkAttendanceResponse() {}

    public MarkAttendanceResponse(int id, Date time, int status, int userId, String userName,
                                  int lectureId, String lectureTitle) {
        this.id = id;
        this.time = time;
        this.status = status;
        this.userId = userId;
        this.userName = userName;
        this.lectureId = lectureId;
        this.lectureTitle = lectureTitle;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getLectureId() {
        return lectureId;
    }

    public void setLectureId(int lectureId) {
        this.lectureId = lectureId;
    }

    public String getLectureTitle() {
        return lectureTitle;
    }

    public void setLectureTitle(String lectureTitle) {
        this.lectureTitle = lectureTitle;
    }

    // ➕ Getter/Setter cho user
    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    // ➕ Getter/Setter cho lecture
    public LectureResponse getLecture() {
        return lecture;
    }

    public void setLecture(LectureResponse lecture) {
        this.lecture = lecture;
    }
}
