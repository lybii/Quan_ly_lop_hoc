package com.example.quan_ly_lop_hoc.repository;

import java.util.List;
import java.util.Optional;

import javax.management.Notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.quan_ly_lop_hoc.entity.ClassUser;
import com.example.quan_ly_lop_hoc.entity.Notifications;
import com.example.quan_ly_lop_hoc.entity.UserNotification;
import com.example.quan_ly_lop_hoc.entity.User;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Integer> {
    Optional<UserNotification> findByNotificationIdAndUserId(int notificationId, int userId);

    List<UserNotification> findAllByNotificationId(int notificationId);

    List<UserNotification> findByUserIn(List<User> users);

/*@Query(value = """
    SELECT n.* FROM user_notification un
    JOIN user u ON un.user_id = u.id
    JOIN class_user cu ON cu.user_id = u.id
    JOIN notification n ON n.id = un.notification_id
    WHERE cu.class_id = :classId
""", nativeQuery = true)
List<Notifications> findNotificationsByClassId(@Param("classId") Integer classId);
*/
@Query(value = """
    SELECT n.id, n.title, n.content, n.status, u.id as userId
    FROM user_notification un
    JOIN user u ON un.user_id = u.id
    JOIN class_user cu ON cu.user_id = u.id
    JOIN notification n ON n.id = un.notification_id
    WHERE cu.class_id = :classId
""", nativeQuery = true)
List<Object[]> findNotificationsByClassId(@Param("classId") Integer classId);

@Query("SELECT un FROM user_notification un WHERE un.user.email = :email")
    List<UserNotification> findByUserEmail(String email);
}
