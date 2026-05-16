package com.example.quan_ly_lop_hoc.entity;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity(name = "notification")
public class Notifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "status")
    private int status;

    // Quan hệ 1-N: Một User có thể tạo nhiều Notification
    @ManyToOne
    @JoinColumn(name = "user_id") // Người tạo thông báo
    private User user;

    // Quan hệ N-N: Một Notification có thể được gửi đến nhiều User
    @OneToMany(mappedBy = "notification")
    @JsonIgnore
    private List<UserNotification> userNotifications;

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

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
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

    public List<UserNotification> getUserNotifications() {
        return userNotifications;
    }
    public void setUserNotifications(List<UserNotification> userNotifications) {
        this.userNotifications = userNotifications;
    }

}
