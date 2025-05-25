package com.example.quan_ly_lop_hoc.dto;

import java.util.Date;

import com.example.quan_ly_lop_hoc.entity.Role;

public class UserDTO {
    private int id;
    private String userName;
    private String email;
    private Date dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String avatar;
    private String code;
    private String major;
    private int status;
    private RoleDTO role;

    public UserDTO() {}

    public UserDTO(int id, String userName, String email, Date dateOfBirth, String gender, String phoneNumber, 
                   String avatar, String code, String major, int status, RoleDTO role) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.avatar = avatar;
        this.code = code;
        this.major = major;
        this.status = status;
        this.role = role;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public RoleDTO getRole() {
        return role;
    }

    public void setRole(RoleDTO role) {
        this.role = role;
    }
}
