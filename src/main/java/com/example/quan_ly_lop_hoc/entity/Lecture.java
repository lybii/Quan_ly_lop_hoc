package com.example.quan_ly_lop_hoc.entity;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity(name = "lecture")
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "file")
    private String file;

    @Column(name = "start_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    @Column(name = "end_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;

    @Column(name = "status")
    private int status;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class class1;

    @OneToMany(mappedBy = "lecture")
    private List<MarkAttendance> markAttendances;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public Class getClass1() {
        return class1;
    }
    public void setClass1(Class class1) {
        this.class1 = class1;
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

    public String getFile() {
        return file;
    }
    public void setFile(String file) {
        this.file = file;
    }

    public Date getStartTime() {
        return startTime;
    }
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    public List<MarkAttendance> getMarkAttendances() { 
        return markAttendances; 
    }
    public void setMarkAttendances(List<MarkAttendance> markAttendances) { 
        this.markAttendances = markAttendances; 
    }
}
