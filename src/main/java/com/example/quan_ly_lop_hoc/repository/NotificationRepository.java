package com.example.quan_ly_lop_hoc.repository;

import javax.management.Notification;
import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.quan_ly_lop_hoc.entity.Notifications;
import com.example.quan_ly_lop_hoc.entity.UserNotification;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, Integer> {

}