package com.example.quan_ly_lop_hoc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.quan_ly_lop_hoc.entity.Assignment;
import com.example.quan_ly_lop_hoc.entity.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
    
    List<Submission> findByAssignment(Assignment assignment);

    List<Submission> findByUserId(int userId);
}
