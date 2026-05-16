package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    // Lấy tất cả sinh viên (roleId = 1)
    List<User> findByRoleId(int roleId);

    // Tìm kiếm theo tên hoặc mã
    @Query("SELECT u FROM user u WHERE LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchByNameOrCode(@Param("keyword") String keyword);
}