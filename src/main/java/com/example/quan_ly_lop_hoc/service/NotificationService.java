package com.example.quan_ly_lop_hoc.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.management.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.quan_ly_lop_hoc.dto.AssignmentResponse;
import com.example.quan_ly_lop_hoc.dto.NotificationRequest;
import com.example.quan_ly_lop_hoc.dto.NotificationResponse;
import com.example.quan_ly_lop_hoc.entity.Notifications;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.NotificationRepository;
import com.example.quan_ly_lop_hoc.repository.UserNotificationRepository;
import com.example.quan_ly_lop_hoc.repository.UserRepository;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.ArrayList;



@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    private NotificationResponse convertToResponse(Notifications notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getTitle(),
            notification.getContent(),
            notification.getStatus(),
            notification.getUser() != null ? notification.getUser().getId() : 0
        );
    }

    // Add Notification
    public NotificationResponse addNotification(NotificationRequest request, User currentUser) {
        if (currentUser.getId() != 2) {
            throw new RuntimeException("Bạn không có quyền thêm thông báo");
        }

        Notifications notification = new Notifications();
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setStatus(request.getStatus());

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            notification.setUser(user);
        }

        Notifications savedNotification = notificationRepository.save(notification);
        return convertToResponse(savedNotification);
    }

    //Update
    public NotificationResponse updateNotification(int id, NotificationRequest request, User currentUser) {
    if (currentUser.getId() != 2) {
        throw new RuntimeException("Bạn không có quyền cập nhật thông báo");
    }

    Optional<Notifications> optionalNotification = notificationRepository.findById(id);
    if (optionalNotification.isEmpty()) {
        throw new RuntimeException("Không tìm thấy thông báo với ID: " + id);
    }

    Notifications notification = optionalNotification.get();
    notification.setTitle(request.getTitle());
    notification.setContent(request.getContent());
    notification.setStatus(request.getStatus());

    // Nếu có userId, cập nhật luôn người dùng
    if (request.getUserId() != null) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));
        notification.setUser(user);
    }

    Notifications updatedNotification = notificationRepository.save(notification);
    return convertToResponse(updatedNotification);
    }

    //Delete
    public void deleteNotification(int id, User currentUser) {
    if (currentUser.getId() != 2) {
        throw new RuntimeException("Bạn không có quyền xóa thông báo");
    }

    Notifications notification = notificationRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo với ID: " + id));

    notificationRepository.delete(notification);
    }

    //Lấy chi tiết
    public NotificationResponse getNotificationById(int id) {
    Notifications notification = notificationRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo với ID: " + id));
    
    return convertToResponse(notification);
    }

    //Lấy danh sách
    /*public List<Notifications> getNotificationsByClassId(int classId) {
        return userNotificationRepository.findNotificationsByClassId(classId);

}*/
/*public List<NotificationResponse> getNotificationsByClassId(int classId) {
    List<Object[]> results = userNotificationRepository.findNotificationsByClassId(classId);
    return results.stream()
        .map(row -> new NotificationResponse(
            ((Number) row[0]).intValue(),    // n.id
            (String) row[1],                 // n.title
            (String) row[2],                 // n.content
            ((Number) row[3]).intValue(),    // n.status
            ((Number) row[4]).intValue()     // u.id as userId
        ))
        .collect(Collectors.toList());
}
*/
public List<NotificationResponse> getNotificationsByClassId(int classId) {
    List<Object[]> results = userNotificationRepository.findNotificationsByClassId(classId);

    // Dùng LinkedHashMap để loại bỏ trùng, giữ thứ tự theo notification id
    Map<Integer, NotificationResponse> distinctMap = new LinkedHashMap<>();

    for (Object[] row : results) {
        int notificationId = ((Number) row[0]).intValue();

        // Nếu chưa có thông báo này trong map thì thêm vào
        if (!distinctMap.containsKey(notificationId)) {
            NotificationResponse response = new NotificationResponse(
                notificationId,
                (String) row[1],                   // title
                (String) row[2],                   // content
                ((Number) row[3]).intValue(),     // status
                ((Number) row[4]).intValue()      // userId
            );
            distinctMap.put(notificationId, response);
        }
        // Nếu đã có rồi thì bỏ qua (loại trùng)
    }

    return new ArrayList<>(distinctMap.values());
}


}