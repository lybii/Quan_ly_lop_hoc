package com.example.quan_ly_lop_hoc.repository;

import javax.management.Notification;
import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.quan_ly_lop_hoc.entity.Notifications;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, Integer> {
    // Bạn có thể thêm các phương thức tuỳ chỉnh ở đây nếu cần


}
