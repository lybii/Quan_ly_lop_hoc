package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.NotificationResponse;
import com.example.quan_ly_lop_hoc.service.ClassNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class-notifications")
public class ClassNotificationController {

    private final ClassNotificationService classNotificationService;

    public ClassNotificationController(ClassNotificationService classNotificationService) {
        this.classNotificationService = classNotificationService;
    }

    // Lấy danh sách thông báo theo classId
    @GetMapping("/notifications/{classId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByClassId(@PathVariable Integer classId) {
        List<NotificationResponse> notifications = classNotificationService.getNotificationsByClassId(classId);
        if (notifications.isEmpty()) {
            return ResponseEntity.noContent().build(); // hoặc trả về lỗi nếu muốn
        }
        return ResponseEntity.ok(notifications);
    }
}
