package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Integer> {

    List<Lecture> findByClass1Id(Integer classId);

    @Query("SELECT l FROM lecture l WHERE l.class1.id = :classId AND l.endTime <= :endTime")
    List<Lecture> findByClassIdAndEndTimeBeforeOrEqual(@Param("classId") Integer classId, @Param("endTime") Date endTime);
}