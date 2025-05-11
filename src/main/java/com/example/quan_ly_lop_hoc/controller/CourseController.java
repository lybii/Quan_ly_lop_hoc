package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.ClassDTO;
import com.example.quan_ly_lop_hoc.dto.CourseDTO;
import com.example.quan_ly_lop_hoc.payload.ResponseData;
import com.example.quan_ly_lop_hoc.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Thêm khóa học mới (admin)
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> addCourse(@Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO savedCourse = courseService.addCourse(courseDTO);
        ResponseData responseData = new ResponseData(200, true, "Thêm khóa học thành công", savedCourse);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy tất cả khóa học (admin)
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách khóa học thành công", courses);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy danh sách khóa học của giảng viên (teacher)
    @GetMapping("/teacher/{userId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<ResponseData> getAllCoursesOfTeacher(@PathVariable int userId) {
        List<CourseDTO> courses = courseService.getAllCoursesOfTeacher(userId);
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách khóa học của giảng viên thành công", courses);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy chi tiết khóa học (admin, teacher)
    @GetMapping("/{courseId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<ResponseData> getCourse(@PathVariable int courseId) {
        CourseDTO course = courseService.getCourse(courseId);
        ResponseData responseData = new ResponseData(200, true, "Lấy chi tiết khóa học thành công", course);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy tất cả lớp học của khóa học (admin)
    @GetMapping("/{courseId}/classes")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getAllClasses(@PathVariable int courseId) {
        List<ClassDTO> classes = courseService.getAllClasses(courseId);
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách lớp học của khóa học thành công", classes);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy lớp học mà giảng viên giảng dạy trong một khóa học (teacher)
    @GetMapping("/{courseId}/classes/teacher/{userId}")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<ResponseData> getAllClassesOfTeacher(@PathVariable int courseId, @PathVariable int userId) {
        List<ClassDTO> classes = courseService.getAllClassesOfTeacher(courseId, userId);
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách lớp học của giảng viên thành công", classes);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Xóa khóa học (chuyển trạng thái, admin)
    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> deleteCourse(@PathVariable int courseId) {
        courseService.deleteCourse(courseId);
        ResponseData responseData = new ResponseData(200, true, "Xóa khóa học thành công", null);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Cập nhật khóa học (admin)
    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> updateCourse(@PathVariable int courseId, @Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO updatedCourse = courseService.updateCourse(courseId, courseDTO);
        ResponseData responseData = new ResponseData(200, true, "Cập nhật khóa học thành công", updatedCourse);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Tìm kiếm khóa học theo tên hoặc mã (admin)
    @GetMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> searchCourseByNameOrCode(@RequestParam String keyword) {
        List<CourseDTO> courses = courseService.searchCourseByNameOrCode(keyword);
        ResponseData responseData = new ResponseData(200, true, "Tìm kiếm khóa học thành công", courses);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}