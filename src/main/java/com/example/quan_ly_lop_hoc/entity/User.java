package com.example.quan_ly_lop_hoc.entity;

import java.util.Date;
import java.util.List;
import java.util.Collection;
import java.util.Collections;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity(name = "user")
public class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_name")
    private String userName;
    
    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "date_of_birth")
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "code")
    private String code;

    @Column(name = "major")
    private String major;

    @Column(name = "status")
    private int status;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<ClassUser> classUsers;

    @OneToMany(mappedBy = "user")
    private List<MarkAttendance> markAttendances;

    @OneToMany(mappedBy = "user")
    private List<Submission> submissions;

    @OneToMany(mappedBy = "user")
    private List<Comment> comments;

    @OneToMany(mappedBy = "user")
    private List<Notifications> notifications;

     // Implement phương thức của UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.getName().toUpperCase()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == 1; // Chỉ tài khoản có status = 1 mới được đăng nhập
    }


    public int getId() { 
        return id; 
    }
    public void setId(int id) { 
        this.id = id; 
    }

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPassword() { 
        return password; 
    }
    public void setPassword(String password) { 
        this.password = password; 
    }

    public String getUserName() { 
        return userName; 
    }
    public void setUserName(String userName) { 
        this.userName = userName; 
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

    public Role getRole() { 
        return role; 
    }
    public void setRole(Role role) { 
        this.role = role; 
    }

    public int getStatus() { 
        return status; 
    }
    public void setStatus(int status) { 
        this.status = status; 
    }

    public List<ClassUser> getClassUsers() { 
        return classUsers; 
    }
    public void setClassUsers(List<ClassUser> classUsers) { 
        this.classUsers = classUsers; 
    }

    public List<MarkAttendance> getMarkAttendances() { 
        return markAttendances; 
    }
    public void setMarkAttendances(List<MarkAttendance> markAttendances) { 
        this.markAttendances = markAttendances; 
    }

    public List<Submission> getSubmissions() { 
        return submissions; 
    }
    public void setSubmissions(List<Submission> submissions) { 
        this.submissions = submissions; 
    }

    public List<Comment> getComments() { 
        return comments; 
    }
    public void setComments(List<Comment> comments) { 
        this.comments = comments; 
    }

    public List<Notifications> getNotifications() { 
        return notifications; 
    }
    public void setNotifications(List<Notifications> notifications) { 
        this.notifications = notifications; 
    }
}

