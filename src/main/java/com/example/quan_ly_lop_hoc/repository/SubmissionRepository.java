package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
    List<Submission> findByUserId(int userId);
}