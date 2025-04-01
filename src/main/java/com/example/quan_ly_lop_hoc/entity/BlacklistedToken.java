package com.example.quan_ly_lop_hoc.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "blacklisted_token")
public class BlacklistedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "blacklisted_at", nullable = false)
    private Date blacklistedAt;

    public BlacklistedToken() {}

    public BlacklistedToken(String token, Date blacklistedAt) {
        this.token = token;
        this.blacklistedAt = blacklistedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getBlacklistedAt() {
        return blacklistedAt;
    }

    public void setBlacklistedAt(Date blacklistedAt) {
        this.blacklistedAt = blacklistedAt;
    }
}