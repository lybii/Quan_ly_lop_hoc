package com.example.quan_ly_lop_hoc.entity;
import java.util.Date;

import jakarta.persistence.*;

@Entity(name = "user_notification")
public class UserNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "notification_id")
    private Notifications notification;

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

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Notifications getNotification() {
        return notification;
    }
    public void setNotification(Notifications notification) {
        this.notification = notification;
    }

}