package com.example.quan_ly_lop_hoc.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.quan_ly_lop_hoc.entity.ClassUser;
import com.example.quan_ly_lop_hoc.entity.Notifications;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.entity.UserNotification;
import com.example.quan_ly_lop_hoc.repository.ClassUserRepository;
import com.example.quan_ly_lop_hoc.repository.NotificationRepository;
import com.example.quan_ly_lop_hoc.repository.UserNotificationRepository;
import com.example.quan_ly_lop_hoc.repository.UserRepository;
import com.example.quan_ly_lop_hoc.dto.NotificationResponse;
import com.example.quan_ly_lop_hoc.dto.UserNotificationRequest;
import com.example.quan_ly_lop_hoc.dto.UserNotificationResponse;

@Service
public class UserNotificationService {

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClassUserRepository classUserRepository;


    public void addUserNotifications(UserNotificationRequest request) {
    Notifications notification = notificationRepository.findById(request.getNotificationId())
        .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo với ID: " + request.getNotificationId()));

    Date timeToUse = request.getTime() != null ? request.getTime() : new Date();

    // Lấy tất cả ClassUser có classId tương ứng
    List<ClassUser> classUsers = classUserRepository.findByClass1Id(request.getClassId());

    if (classUsers.isEmpty()) {
        throw new RuntimeException("Không tìm thấy học sinh nào trong lớp với ID: " + request.getClassId());
    }

    List<UserNotification> userNotifications = classUsers.stream().map(classUser -> {
        User user = classUser.getUser();
        UserNotification un = new UserNotification();
        un.setNotification(notification);
        un.setUser(user);
        un.setTime(timeToUse);
        return un;
    }).collect(Collectors.toList());

    userNotificationRepository.saveAll(userNotifications);
}

    // Xóa UserNotification theo notificationId và userId (xóa một user nhận notification)
    public void deleteUserNotification(int notificationId, int userId) {
        Optional<UserNotification> optionalUN = userNotificationRepository.findByNotificationIdAndUserId(notificationId, userId);
        if(optionalUN.isEmpty()) {
            throw new RuntimeException("Không tìm thấy UserNotification với notificationId: " + notificationId + " và userId: " + userId);
        }
        userNotificationRepository.delete(optionalUN.get());
    }

    // Xóa tất cả UserNotification của một notification (gỡ bỏ gửi cho tất cả user)
    public void deleteUserNotificationsByNotificationId(int notificationId) {
        List<UserNotification> list = userNotificationRepository.findAllByNotificationId(notificationId);
        userNotificationRepository.deleteAll(list);
    }

}
