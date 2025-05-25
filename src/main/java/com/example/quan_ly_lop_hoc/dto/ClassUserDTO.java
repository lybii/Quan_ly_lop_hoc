package com.example.quan_ly_lop_hoc.dto;

public class ClassUserDTO {
    private int id;
    private UserDTO user;
    private int classId;

    public ClassUserDTO() {
    }

    public ClassUserDTO(int id, UserDTO user, int classId) {
        this.id = id;
        this.user = user;
        this.classId = classId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public int getClassId() {
        return classId;
    }

    public void setClassId(int classId) {
        this.classId = classId;
    }
}