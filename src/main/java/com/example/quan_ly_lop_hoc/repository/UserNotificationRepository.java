package com.example.quan_ly_lop_hoc.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.quan_ly_lop_hoc.entity.ClassUser;
import com.example.quan_ly_lop_hoc.entity.UserNotification;
import com.example.quan_ly_lop_hoc.entity.User;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Integer> {
    Optional<UserNotification> findByNotificationIdAndUserId(int notificationId, int userId);

    List<UserNotification> findAllByNotificationId(int notificationId);

    List<UserNotification> findByUserIn(List<User> users);
}
