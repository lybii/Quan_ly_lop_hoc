package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.ClassDTO;
import com.example.quan_ly_lop_hoc.dto.ClassDetailDTO;
import com.example.quan_ly_lop_hoc.dto.LearningProcessDTO;
import com.example.quan_ly_lop_hoc.payload.ResponseData;
import com.example.quan_ly_lop_hoc.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    // Thêm lớp học mới (admin)
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> addClass(@Valid @RequestBody ClassDTO classDTO) {
        ClassDTO savedClass = classService.addClass(classDTO);
        ResponseData responseData = new ResponseData(200, true, "Thêm lớp học thành công", savedClass);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy tất cả lớp học của một khóa học (admin)
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getAllClassOfCourse(@PathVariable int courseId) {
        List<ClassDTO> classes = classService.getAllClassOfCourse(courseId);
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách lớp học thành công", classes);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Tìm kiếm lớp học theo tên hoặc mã (admin)
    @GetMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> searchClassByNameOrCode(@RequestParam String keyword) {
        List<ClassDTO> classes = classService.searchClassByNameOrCode(keyword);
        ResponseData responseData = new ResponseData(200, true, "Tìm kiếm lớp học thành công", classes);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Tìm kiếm lớp học theo tên hoặc mã mà giảng viên/sinh viên tham gia (student, lecturer)
    @GetMapping("/search/user")
    @PreAuthorize("hasAnyRole('ROLE_LECTURER', 'ROLE_STUDENT')")
    public ResponseEntity<ResponseData> searchClassOfStudentOrLecturer(@RequestParam String keyword, @RequestParam int userId) {
        List<ClassDTO> classes = classService.searchClassOfStudentOrLecturer(keyword, userId);
        ResponseData responseData = new ResponseData(200, true, "Tìm kiếm lớp học thành công", classes);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy thông tin chi tiết của lớp học (user)
    @GetMapping("/{classId}")
    @PreAuthorize("hasAnyRole('ROLE_LECTURER', 'ROLE_STUDENT', 'ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getClass(@PathVariable int classId) {
        ClassDetailDTO classDetail = classService.getClass(classId);
        ResponseData responseData = new ResponseData(200, true, "Lấy chi tiết lớp học thành công", classDetail);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Xóa lớp học (admin)
    @DeleteMapping("/{classId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> deleteClass(@PathVariable int classId) {
        classService.deleteClass(classId);
        ResponseData responseData = new ResponseData(200, true, "Xóa lớp học thành công", null);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Cập nhật lớp học (admin)
    @PutMapping("/{classId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> updateClass(@PathVariable int classId, @Valid @RequestBody ClassDTO classDTO) {
        ClassDTO updatedClass = classService.updateClass(classId, classDTO);
        ResponseData responseData = new ResponseData(200, true, "Cập nhật lớp học thành công", updatedClass);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy tiến trình học tập của sinh viên (student)
    @GetMapping("/learning-process")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ResponseData> getLearningProcess(@RequestParam int studentId) {
        List<LearningProcessDTO> learningProcesses = classService.getLearningProcess(studentId);
        ResponseData responseData = new ResponseData(200, true, "Lấy tiến trình học tập thành công", learningProcesses);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}