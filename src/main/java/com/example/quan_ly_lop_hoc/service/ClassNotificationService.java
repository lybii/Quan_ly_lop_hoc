package com.example.quan_ly_lop_hoc.service;

import com.example.quan_ly_lop_hoc.dto.NotificationResponse;
import com.example.quan_ly_lop_hoc.entity.ClassNotification;
import com.example.quan_ly_lop_hoc.repository.ClassNotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassNotificationService {

    private final ClassNotificationRepository classNotificationRepository;

    public ClassNotificationService(ClassNotificationRepository classNotificationRepository) {
        this.classNotificationRepository = classNotificationRepository;
    }

    public List<NotificationResponse> getNotificationsByClassId(Integer classId) {
        List<ClassNotification> classNotifications = classNotificationRepository.findByClassId(classId);

        return classNotifications.stream()
            .map(cn -> {
                var notif = cn.getNotification();
                return new NotificationResponse(
                    notif.getId(),
                    notif.getTitle(),
                    notif.getContent(),
                    notif.getStatus(),
                    notif.getUser() != null ? notif.getUser().getId() : 0
                );
            })
            .collect(Collectors.toList());
    }
}
