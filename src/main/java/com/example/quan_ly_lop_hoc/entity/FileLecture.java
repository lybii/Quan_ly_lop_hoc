package com.example.quan_ly_lop_hoc.entity;

import jakarta.persistence.*;

@Entity(name = "file_lecture")
public class FileLecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "file")
    private String file; // Có thể là đường dẫn file hoặc tên file

    @Column(name = "status")
    private int status;

    // Nhiều fileLecture thuộc về 1 lecture
    @ManyToOne
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    // Getter và Setter

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
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

    public Lecture getLecture() {
        return lecture;
    }
    public void setLecture(Lecture lecture) {
        this.lecture = lecture;
    }
}
