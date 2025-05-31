package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {

    @Query("SELECT a FROM Assignment a JOIN a.class1 c JOIN c.classUsers cu WHERE cu.user.email = :email AND a.deadline > :currentDate")
    List<Assignment> findByClassUserEmailAndDeadlineAfter(String email, Date currentDate);

    @Query("SELECT a FROM Assignment a JOIN a.class1 c JOIN c.classUsers cu WHERE cu.user.email = :email AND a.deadline BETWEEN :start AND :end")
    List<Assignment> findByClassUserEmailAndDeadlineWithinWeek(String email, Date start, Date end);
}