package com.example.quan_ly_lop_hoc.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.quan_ly_lop_hoc.entity.UserNotification;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Integer> {
    Optional<UserNotification> findByNotificationIdAndUserId(int notificationId, int userId);

    List<UserNotification> findAllByNotificationId(int notificationId);
    
    @Query("SELECT un FROM user_notification un WHERE un.user.id = :userId ORDER BY un.time DESC")
    List<UserNotification> findAllByUserIdOrderByTimeDesc(@Param("userId") int userId);
}
