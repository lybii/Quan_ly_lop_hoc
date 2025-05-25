package com.example.quan_ly_lop_hoc.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "class_user")
public class ClassUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class class1;


    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Class getClass1() {
        return class1;
    }
    public void setClass(Class class1) {
        this.class1 = class1;
    }
}
