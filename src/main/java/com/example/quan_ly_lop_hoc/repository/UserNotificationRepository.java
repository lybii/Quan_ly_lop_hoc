package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Integer> {
    @Query("SELECT un FROM user_notification un WHERE un.user.email = :email")
    List<UserNotification> findByUserEmail(String email);
}