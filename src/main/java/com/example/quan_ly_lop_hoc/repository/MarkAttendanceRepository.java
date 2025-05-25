package com.example.quan_ly_lop_hoc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.quan_ly_lop_hoc.entity.MarkAttendance;

public interface MarkAttendanceRepository extends JpaRepository<MarkAttendance, Integer> {
    List<MarkAttendance> findByLectureId(Integer lectureId);
}
