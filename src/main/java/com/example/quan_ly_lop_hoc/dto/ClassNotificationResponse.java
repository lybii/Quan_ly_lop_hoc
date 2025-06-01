package com.example.quan_ly_lop_hoc.dto;

public class ClassNotificationResponse {

    private Integer id;
    private Integer notificationId;
    private String notificationTitle;
    private String notificationContent;
    private Integer classId;
    private String className; // giả sử bạn muốn trả về tên lớp

    public ClassNotificationResponse() {}

    public ClassNotificationResponse(Integer id, Integer notificationId, String notificationTitle, String notificationContent,
                                    Integer classId, String className) {
        this.id = id;
        this.notificationId = notificationId;
        this.notificationTitle = notificationTitle;
        this.notificationContent = notificationContent;
        this.classId = classId;
        this.className = className;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Integer notificationId) {
        this.notificationId = notificationId;
    }

    public String getNotificationTitle() {
        return notificationTitle;
    }

    public void setNotificationTitle(String notificationTitle) {
        this.notificationTitle = notificationTitle;
    }

    public String getNotificationContent() {
        return notificationContent;
    }

    public void setNotificationContent(String notificationContent) {
        this.notificationContent = notificationContent;
    }

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}
