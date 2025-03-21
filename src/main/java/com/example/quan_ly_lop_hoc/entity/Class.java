package com.example.quan_ly_lop_hoc.entity;
import jakarta.persistence.*;
import java.util.List;


@Entity(name = "class")
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(name = "class_code")
    private String classCode;

    @Column(name = "count")
    private int count;

    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private int status;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;    

    @OneToMany(mappedBy = "class1")
    private List<ClassUser> classUsers;

    @OneToMany(mappedBy = "class1")
    private List<Lecture> lectures;
    
    @OneToMany(mappedBy = "class1")
    private List<Assignment> assignments;
    
    public int getId() { 
        return id; 
    }
    public void setId(int id) { 
        this.id = id; 
    }

    public String getType() { 
        return type; 
    }
    public void setType(String type) { 
        this.type = type; 
    }

    public String getClassCode() { 
        return classCode; 
    }
    public void setClassCode(String classCode) { 
        this.classCode = classCode; 
    }

    public int getCount() { 
        return count; 
    }
    public void setCount(int count) { 
        this.count = count; 
    }

    public int getStatus() { 
        return status; 
    }
    public void setStatus(int status) { 
        this.status = status; 
    }

    public Course getCourse() { 
        return course; 
    }
    public void setCourse(Course course) { 
        this.course = course; 
    }

    public List<ClassUser> getClassUsers() { 
        return classUsers; 
    }
    public void setClassUsers(List<ClassUser> classUsers) { 
        this.classUsers = classUsers; 
    }

    public List<Lecture> getLectures() { 
        return lectures; 
    }
    public void setLectures(List<Lecture> lectures) { 
        this.lectures = lectures; 
    }

    public List<Assignment> getAssignments() { 
        return assignments; 
    }
    public void setAssignments(List<Assignment> assignments) { 
        this.assignments = assignments; 
    }
}
