package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, Integer> {

    @Query("SELECT n FROM notification n JOIN n.userNotifications un WHERE un.user.email = :email")
    List<Notifications> findByUserEmail(String email);
}