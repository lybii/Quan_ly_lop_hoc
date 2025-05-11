package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClassRepository extends JpaRepository<Class, Integer> {

    List<Class> findByCourseId(Integer courseId);

    @Query("SELECT c FROM class c LEFT JOIN FETCH c.classUsers WHERE c.course.id = :courseId")
    List<Class> findByCourseIdWithClassUsers(@Param("courseId") Integer courseId);

    @Query("SELECT c FROM class c WHERE LOWER(c.classCode) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Class> searchByNameOrCode(@Param("keyword") String keyword);

    @Query("SELECT c FROM class c JOIN c.classUsers cu WHERE cu.user.id = :studentId")
    List<Class> findClassesByStudentId(@Param("studentId") Integer studentId);

    @Query("SELECT c FROM class c LEFT JOIN FETCH c.classUsers WHERE c.id = :classId")
    Optional<Class> findByIdWithClassUsers(@Param("classId") int classId);

    @Query("SELECT c FROM class c JOIN c.classUsers cu WHERE c.course.id = :courseId AND cu.user.id = :userId AND cu.user.role.name = 'Giảng viên'")
    List<Class> findClassesByCourse_IdAndTeacher_Id(@Param("courseId") Integer courseId, @Param("userId") Integer userId);

    @Query("SELECT c FROM class c JOIN c.classUsers cu LEFT JOIN FETCH c.classUsers WHERE c.course.id = :courseId AND cu.user.id = :userId AND cu.user.role.name = 'Giảng viên'")
    List<Class> findClassesByCourse_IdAndTeacher_IdWithClassUsers(@Param("courseId") Integer courseId, @Param("userId") Integer userId);
}