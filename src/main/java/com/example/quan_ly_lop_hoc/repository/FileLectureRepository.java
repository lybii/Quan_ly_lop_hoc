package com.example.quan_ly_lop_hoc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.quan_ly_lop_hoc.entity.FileLecture;
import com.example.quan_ly_lop_hoc.entity.Lecture;

@Repository
public interface FileLectureRepository extends JpaRepository<FileLecture, Integer> {
    List<FileLecture> findByLecture(Lecture lecture);
}
