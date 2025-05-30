package com.example.quan_ly_lop_hoc.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.quan_ly_lop_hoc.dto.UserNotificationRequest;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.service.UserNotificationService;

@RestController
@RequestMapping("/api/user-notifications")
public class UserNotificationController {

    @Autowired
    private UserNotificationService userNotificationService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    public ResponseEntity<?> addUserNotificationsToClass(@RequestBody UserNotificationRequest request) {
        try {
            userNotificationService.addUserNotifications(request);
            return ResponseEntity.ok("Thêm user notifications cho cả lớp thành công");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Xóa 1 UserNotification theo notificationId và userId
@DeleteMapping("/delete/{notificationId}/{userId}")
@PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
public ResponseEntity<?> deleteUserNotification(
        @PathVariable int notificationId,
        @PathVariable int userId
) {
    try {
        userNotificationService.deleteUserNotification(notificationId, userId);
        return ResponseEntity.ok("Xóa UserNotification thành công");
    } catch (RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}

// Xóa tất cả UserNotification của 1 notification theo notificationId qua URL
@DeleteMapping("/delete-by-notification/{notificationId}")
@PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
public ResponseEntity<?> deleteUserNotificationsByNotificationId(@PathVariable int notificationId) {
    try {
        userNotificationService.deleteUserNotificationsByNotificationId(notificationId);
        return ResponseEntity.ok("Xóa tất cả UserNotification của thông báo thành công");
    } catch (RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
}
