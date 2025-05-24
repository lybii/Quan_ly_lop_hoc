package com.example.quan_ly_lop_hoc.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "mark_attendance")
public class MarkAttendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    @Column(name = "status")
    private int status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;


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

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Lecture getLecture() {
        return lecture;
    }
    public void setLecture(Lecture lecture) {
        this.lecture = lecture;
    }
}
