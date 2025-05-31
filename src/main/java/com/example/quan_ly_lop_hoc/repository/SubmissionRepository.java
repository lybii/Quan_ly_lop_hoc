package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
    List<Submission> findByUserId(int userId);
    @Query("SELECT s FROM submission s JOIN s.assignment a JOIN s.user u WHERE u.email = :userEmail AND a.title = :assignmentTitle")
    Optional<Submission> findByUserEmailAndAssignmentTitle(String userEmail, String assignmentTitle);
}