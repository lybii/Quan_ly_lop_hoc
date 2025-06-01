package com.example.quan_ly_lop_hoc.entity;

import java.util.Date;
import jakarta.persistence.*;

@Entity(name = "class_notification")
public class ClassNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class class1;  // hoặc đổi tên cho phù hợp, tránh trùng từ khóa 'class'

    @ManyToOne
    @JoinColumn(name = "notification_id")
    private Notifications notification;

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

    public Class getClass1() {
        return class1;
    }
    public void setClass1(Class class1) {
        this.class1 = class1;
    }

    public Notifications getNotification() {
        return notification;
    }
    public void setNotification(Notifications notification) {
        this.notification = notification;
    }
}
