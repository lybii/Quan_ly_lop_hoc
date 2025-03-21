package com.example.quan_ly_lop_hoc.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "assignment")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    @Column(name = "deadline")
    @Temporal(TemporalType.TIMESTAMP)
    private Date deadline;

    @Column(name = "file")
    private String file;

    @Column(name = "status")
    private int status;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class class1;
    
    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Submission> submissions;


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

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTime() {
        return time;
    }
    public void setTime(Date time) {
        this.time = time;
    }

    public Date getDeadline() {
        return deadline;
    }
    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public String getFile() {
        return file;
    }
    public void setFile(String file) {
        this.file = file;
    }

    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    public Class getClass1() {
        return class1;
    }
    public void setClass1(Class clazz) {
        this.class1 = clazz;
    }

    public List<Submission> getSubmissions() {
        return submissions;
    }
    public void setSubmissions(List<Submission> submissions) {
        this.submissions = submissions;
    }
}
