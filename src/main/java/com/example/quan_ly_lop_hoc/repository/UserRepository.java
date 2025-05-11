package com.example.quan_ly_lop_hoc.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.quan_ly_lop_hoc.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    // Lấy tất cả sinh viên (roleId = 1)
    List<User> findByRoleId(int roleId);
}