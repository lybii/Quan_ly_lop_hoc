package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    @Query("SELECT c FROM course c WHERE LOWER(c.courseName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Course> searchByNameOrCode(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT c FROM course c JOIN c.classes cl JOIN cl.classUsers cu WHERE cu.user.id = :userId AND cu.user.role.name = 'Giảng viên'")
    List<Course> findCoursesByTeacherId(@Param("userId") Integer userId);
}