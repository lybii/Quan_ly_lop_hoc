package com.example.quan_ly_lop_hoc.service;

import com.example.quan_ly_lop_hoc.dto.ClassDTO;
import com.example.quan_ly_lop_hoc.dto.CourseDTO;
import com.example.quan_ly_lop_hoc.entity.Class;
import com.example.quan_ly_lop_hoc.entity.Course;
import com.example.quan_ly_lop_hoc.exception.NotFoundException;
import com.example.quan_ly_lop_hoc.repository.ClassRepository;
import com.example.quan_ly_lop_hoc.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ClassRepository classRepository;

    // Thêm khóa học mới
    public CourseDTO addCourse(CourseDTO courseDTO) {
        Course course = new Course();
        course.setCourseName(courseDTO.getCourseName());
        course.setDescription(courseDTO.getDescription());
        course.setCourseCode(courseDTO.getCourseCode());
        course.setCredits(courseDTO.getCredits());
        course.setStatus(1); // Mặc định là đang mở
        course = courseRepository.save(course);
        return mapToDTO(course);
    }

    // Lấy tất cả khóa học
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Lấy danh sách khóa học của giảng viên
    public List<CourseDTO> getAllCoursesOfTeacher(int userId) {
        return courseRepository.findCoursesByTeacherId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Lấy chi tiết khóa học
    public CourseDTO getCourse(int courseId) {
        Supplier<NotFoundException> exceptionSupplier = () -> new NotFoundException("Khóa học không tồn tại");
        Course course = courseRepository.findById(courseId)
                .orElseThrow(exceptionSupplier);
        return mapToDTO(course);
    }

    // Lấy tất cả lớp học của khóa học
    public List<ClassDTO> getAllClasses(int courseId) {
        Supplier<NotFoundException> exceptionSupplier = () -> new NotFoundException("Khóa học không tồn tại");
        courseRepository.findById(courseId)
                .orElseThrow(exceptionSupplier);
        return classRepository.findByCourseIdWithClassUsers(courseId).stream()
                .map(this::mapClassToDTO)
                .collect(Collectors.toList());
    }

    // Lấy lớp học mà giảng viên giảng dạy trong một khóa học
    public List<ClassDTO> getAllClassesOfTeacher(int courseId, int userId) {
        Supplier<NotFoundException> exceptionSupplier = () -> new NotFoundException("Khóa học không tồn tại");
        courseRepository.findById(courseId)
                .orElseThrow(exceptionSupplier);
        return classRepository.findClassesByCourse_IdAndTeacher_IdWithClassUsers(courseId, userId).stream()
                .map(this::mapClassToDTO)
                .collect(Collectors.toList());
    }

    // Xóa khóa học (chuyển trạng thái thành 0)
    public void deleteCourse(int courseId) {
        Supplier<NotFoundException> exceptionSupplier = () -> new NotFoundException("Khóa học không tồn tại");
        Course course = courseRepository.findById(courseId)
                .orElseThrow(exceptionSupplier);
        course.setStatus(0);
        courseRepository.save(course);
    }

    // Cập nhật khóa học
    public CourseDTO updateCourse(int courseId, CourseDTO courseDTO) {
        Supplier<NotFoundException> exceptionSupplier = () -> new NotFoundException("Khóa học không tồn tại");
        Course course = courseRepository.findById(courseId)
                .orElseThrow(exceptionSupplier);
        course.setCourseName(courseDTO.getCourseName());
        course.setDescription(courseDTO.getDescription());
        course.setCourseCode(courseDTO.getCourseCode());
        course.setCredits(courseDTO.getCredits());
        course.setStatus(courseDTO.getStatus());
        course = courseRepository.save(course);
        return mapToDTO(course);
    }

    // Tìm kiếm khóa học theo tên hoặc mã
    public List<CourseDTO> searchCourseByNameOrCode(String keyword) {
        return courseRepository.searchByNameOrCode(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Ánh xạ Course entity sang CourseDTO
    private CourseDTO mapToDTO(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getCourseName(),
                course.getDescription(),
                course.getCourseCode(),
                course.getCredits(),
                course.getStatus(),
                null // Không lấy danh sách lớp học mặc định
        );
    }

    // Ánh xạ Class entity sang ClassDTO
    private ClassDTO mapClassToDTO(Class classEntity) {
        int classUserId = 0;
        if (!classEntity.getClassUsers().isEmpty()) {
            classUserId = classEntity.getClassUsers().stream()
                    .filter(cu -> "LECTURER".equals(cu.getUser().getRole().getName()))
                    .map(cu -> cu.getUser().getId())
                    .findFirst()
                    .orElse(0);
        }
        return new ClassDTO(
                classEntity.getId(),
                classEntity.getClassCode(),
                classEntity.getType(),
                classEntity.getCount(),
                classEntity.getStatus(),
                classEntity.getCourse().getId(),
                classUserId
        );
    }
}