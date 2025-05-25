package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.ClassUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassUserRepository extends JpaRepository<ClassUser, Integer> {

    @Query("SELECT cu FROM ClassUser cu WHERE cu.class1.id = :classId")
    List<ClassUser> findByClassId(@Param("classId") Integer classId);

    boolean existsByUserId(Integer userId);
}