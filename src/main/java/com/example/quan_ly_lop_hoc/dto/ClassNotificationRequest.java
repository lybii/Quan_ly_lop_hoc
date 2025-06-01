package com.example.quan_ly_lop_hoc.dto;

import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class ClassNotificationRequest {

    @NotNull(message = "Notification ID is required")
    private Integer notificationId;

    @NotNull(message = "Class ID is required")
    private Integer classId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date time;  // Có thể null, nếu null thì dùng thời gian hiện tại

    public ClassNotificationRequest() {}

    public ClassNotificationRequest(Integer notificationId, Integer classId, Date time) {
        this.notificationId = notificationId;
        this.classId = classId;
        this.time = time;
    }

    public Integer getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Integer notificationId) {
        this.notificationId = notificationId;
    }

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
