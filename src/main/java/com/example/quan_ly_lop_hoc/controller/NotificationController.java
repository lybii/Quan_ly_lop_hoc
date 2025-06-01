package com.example.quan_ly_lop_hoc.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.quan_ly_lop_hoc.dto.NotificationRequest;
import com.example.quan_ly_lop_hoc.dto.NotificationResponse;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Add Notification
    /*@PostMapping("/add")
    public NotificationResponse addNotification(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam Integer status,
            @RequestParam(required = false) Integer userId) {

        // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
        User currentUser = getCurrentLoggedInUser(); // Hàm giả định

        // Tạo đối tượng NotificationRequest từ các tham số
        NotificationRequest request = new NotificationRequest();
        request.setTitle(title);
        request.setContent(content);
        request.setStatus(status);
        request.setUserId(userId);

        return notificationService.addNotification(request, currentUser);
    }*/

    @PostMapping("/add")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
public NotificationResponse addNotification(@RequestBody NotificationRequest request) {

    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định

    return notificationService.addNotification(request, currentUser);
}

    //Update
    /*@PutMapping("/update/{id}")
    public ResponseEntity<?> updateNotification(@PathVariable int id,
                                            @RequestParam String title,
                                            @RequestParam String content,
                                            @RequestParam Integer status,
                                            @RequestParam(required = false) Integer userId) {

    // Giả định hàm lấy user đăng nhập
    User currentUser = getCurrentLoggedInUser(); // Bạn nên thay bằng cách lấy từ SecurityContext thực tế

    // Tạo đối tượng NotificationRequest từ các tham số
    NotificationRequest request = new NotificationRequest();
    request.setTitle(title);
    request.setContent(content);
    request.setStatus(status);
    request.setUserId(userId);

    // Gọi service để cập nhật thông báo
    NotificationResponse updatedNotification = notificationService.updateNotification(id, request, currentUser);

    return ResponseEntity.ok(updatedNotification);
    }*/

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
public ResponseEntity<?> updateNotification(
    @PathVariable int id,
    @RequestBody NotificationRequest request) {

    // Giả định hàm lấy user đăng nhập
    User currentUser = getCurrentLoggedInUser(); // Thay bằng cách lấy thực tế từ SecurityContext

    // Gọi service để cập nhật thông báo
    NotificationResponse updatedNotification = notificationService.updateNotification(id, request, currentUser);

    return ResponseEntity.ok(updatedNotification);
}

    //Delete
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteNotification(@PathVariable int id) {
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định như bạn đã dùng
    notificationService.deleteNotification(id, currentUser);
    return ResponseEntity.ok("Xóa thông báo thành công");
    }

    //Lấy danh sách
    @GetMapping("/class/{classId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByClassId(@PathVariable int classId) {
        List<NotificationResponse> notifications = notificationService.getNotificationsByClassId(classId);
        return ResponseEntity.ok(notifications);
    }
    
    //Lấy chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable int id) {
        NotificationResponse notificationResponse = notificationService.getNotificationById(id);
        return ResponseEntity.ok(notificationResponse);
    }


    // Triển khai lấy user hiện tại từ session hoặc token
    private User getCurrentLoggedInUser() {
        User user = new User();
        user.setId(2); // Tạm thời hard-code là Admin
        return user;
    }

}
