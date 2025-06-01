package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.ClassNotification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassNotificationRepository extends JpaRepository<ClassNotification, Integer> {

    @Query("SELECT cn FROM class_notification cn WHERE cn.class1.id = :classId")
    List<ClassNotification> findByClassId(@Param("classId") Integer classId);
}