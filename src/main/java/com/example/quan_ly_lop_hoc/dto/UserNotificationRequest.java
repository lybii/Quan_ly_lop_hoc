package com.example.quan_ly_lop_hoc.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class UserNotificationRequest {

    @NotNull(message = "Notification ID is required")
    private Integer notificationId;

    @NotNull(message = "User IDs list is required")
    private List<Integer> userIds;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date time;  // Có thể null, nếu null thì dùng thời gian hiện tại

    public UserNotificationRequest() {}

    public UserNotificationRequest(Integer notificationId, List<Integer> userIds, Date time) {
        this.notificationId = notificationId;
        this.userIds = userIds;
        this.time = time;
    }

    public Integer getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Integer notificationId) {
        this.notificationId = notificationId;
    }

    public List<Integer> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Integer> userIds) {
        this.userIds = userIds;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
