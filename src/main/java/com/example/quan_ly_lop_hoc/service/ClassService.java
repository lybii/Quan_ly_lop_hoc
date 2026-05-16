package com.example.quan_ly_lop_hoc.service;

import com.example.quan_ly_lop_hoc.dto.ClassDTO;
import com.example.quan_ly_lop_hoc.dto.ClassDetailDTO;
import com.example.quan_ly_lop_hoc.dto.ClassResponseDTO;
import com.example.quan_ly_lop_hoc.dto.ClassUserDTO;
import com.example.quan_ly_lop_hoc.dto.CourseDTO;
import com.example.quan_ly_lop_hoc.dto.LearningProcessDTO;
import com.example.quan_ly_lop_hoc.dto.RoleDTO;
import com.example.quan_ly_lop_hoc.dto.UserDTO;
import com.example.quan_ly_lop_hoc.entity.Class;
import com.example.quan_ly_lop_hoc.entity.ClassUser;
import com.example.quan_ly_lop_hoc.entity.Course;
import com.example.quan_ly_lop_hoc.entity.Lecture;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.exception.NotFoundException;
import com.example.quan_ly_lop_hoc.repository.ClassRepository;
import com.example.quan_ly_lop_hoc.repository.ClassUserRepository;
import com.example.quan_ly_lop_hoc.repository.CourseRepository;
import com.example.quan_ly_lop_hoc.repository.LectureRepository;
import com.example.quan_ly_lop_hoc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ClassUserRepository classUserRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public ClassService(ClassRepository classRepository, CourseRepository courseRepository) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
    }

    public List<ClassResponseDTO> getClassesByCourseId(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found"));
        List<Class> classes = classRepository.findByCourseId(courseId);
        return classes.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private ClassResponseDTO convertToResponseDTO(Class aClass) {
        ClassResponseDTO dto = new ClassResponseDTO();
        dto.setId(aClass.getId());
        dto.setClassCode(aClass.getClassCode());
        dto.setClassName(aClass.getType());
        dto.setCourseId(aClass.getCourse().getId());
        return dto;
    }

    public ClassDTO addClass(ClassDTO classDTO) {
        Course course = courseRepository.findById(classDTO.getCourseId())
                .orElseThrow(() -> new NotFoundException("Khóa học không tồn tại"));

        Class classEntity = new Class();
        classEntity.setClassCode(classDTO.getClassCode());
        classEntity.setType(classDTO.getType());
        classEntity.setCount(classDTO.getCount());
        classEntity.setStatus(1);
        classEntity.setCourse(course);
        classEntity = classRepository.save(classEntity);

        if (classDTO.getClassUserId() != 0) {
            User teacher = userRepository.findById(classDTO.getClassUserId())
                    .orElseThrow(() -> new NotFoundException("Giảng viên không tồn tại"));
            if (!"LECTURER".equals(teacher.getRole().getName())) {
                throw new IllegalArgumentException("Người dùng không phải là giảng viên");
            }
            ClassUser classUser = new ClassUser();
            classUser.setUser(teacher);
            classUser.setClass(classEntity);
            classUserRepository.save(classUser);
        }

        if (classDTO.getStudentIds() != null && !classDTO.getStudentIds().isEmpty()) {
            for (Integer studentId : classDTO.getStudentIds()) {
                User student = userRepository.findById(studentId)
                        .orElseThrow(() -> new NotFoundException("Sinh viên không tồn tại: " + studentId));
                if (!"STUDENT".equals(student.getRole().getName())) {
                    throw new IllegalArgumentException("Người dùng không phải là sinh viên: " + studentId);
                }
                ClassUser classUser = new ClassUser();
                classUser.setUser(student);
                classUser.setClass(classEntity);
                classUserRepository.save(classUser);
            }
        }

        return mapToDTO(classEntity);
    }

    public List<ClassDTO> getAllClassOfCourse(int courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Khóa học không tồn tại"));
        return classRepository.findByCourseId(courseId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ClassDTO> searchClassByNameOrCode(String keyword) {
        return classRepository.searchByNameOrCode(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ClassDetailDTO getClass(int classId) {
        Class classEntity = classRepository.findByIdWithClassUsers(classId)
                .orElseThrow(() -> new NotFoundException("Lớp học không tồn tại"));

        // Tách danh sách người dùng thành giảng viên và sinh viên
        List<ClassUserDTO> lecturers = new ArrayList<>();
        List<ClassUserDTO> students = new ArrayList<>();

        classEntity.getClassUsers().forEach(cu -> {
            ClassUserDTO classUserDTO = new ClassUserDTO(
                    cu.getId(),
                    new UserDTO(
                            cu.getUser().getId(),
                            cu.getUser().getUserName(),
                            cu.getUser().getEmail(),
                            cu.getUser().getDateOfBirth(),
                            cu.getUser().getGender(),
                            cu.getUser().getPhoneNumber(),
                            cu.getUser().getAvatar(),
                            cu.getUser().getCode(),
                            cu.getUser().getMajor(),
                            cu.getUser().getStatus(),
                            new RoleDTO(cu.getUser().getRole().getId(), cu.getUser().getRole().getName())
                    ),
                    cu.getClass1().getId()
            );

            if ("LECTURER".equals(cu.getUser().getRole().getName())) {
                lecturers.add(classUserDTO);
            } else if ("STUDENT".equals(cu.getUser().getRole().getName())) {
                students.add(classUserDTO);
            }
        });

        return new ClassDetailDTO(
                classEntity.getId(),
                classEntity.getClassCode(),
                classEntity.getType(),
                classEntity.getCount(),
                classEntity.getStatus(),
                new CourseDTO(
                        classEntity.getCourse().getId(),
                        classEntity.getCourse().getCourseName(),
                        classEntity.getCourse().getDescription(),
                        classEntity.getCourse().getCourseCode(),
                        classEntity.getCourse().getCredits(),
                        classEntity.getCourse().getStatus(),
                        null),
                lecturers,
                students
        );
    }

    public void deleteClass(int classId) {
        Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Lớp học không tồn tại"));
        classEntity.setStatus(0);
        classRepository.save(classEntity);
    }

    public ClassDTO updateClass(int classId, ClassDTO classDTO) {
        Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Lớp học không tồn tại"));

        Course course = courseRepository.findById(classDTO.getCourseId())
                .orElseThrow(() -> new NotFoundException("Khóa học không tồn tại"));

        classEntity.setClassCode(classDTO.getClassCode());
        classEntity.setType(classDTO.getType());
        classEntity.setCount(classDTO.getCount());
        classEntity.setStatus(classDTO.getStatus());
        classEntity.setCourse(course);
        classEntity = classRepository.save(classEntity);

        if (classDTO.getClassUserId() != 0) {
            classUserRepository.findByClassId(classId).stream()
                    .filter(cu -> "LECTURER".equals(cu.getUser().getRole().getName()))
                    .forEach(classUserRepository::delete);

            User teacher = userRepository.findById(classDTO.getClassUserId())
                    .orElseThrow(() -> new NotFoundException("Giảng viên không tồn tại"));
            if (!"LECTURER".equals(teacher.getRole().getName())) {
                throw new IllegalArgumentException("Người dùng không phải là giảng viên");
            }
            ClassUser classUser = new ClassUser();
            classUser.setUser(teacher);
            classUser.setClass(classEntity);
            classUserRepository.save(classUser);
        }

        return mapToDTO(classEntity);
    }

    public List<LearningProcessDTO> getLearningProcess(int studentId) {
        if (!classUserRepository.existsByUserId(studentId)) {
            throw new NotFoundException("Sinh viên không tồn tại hoặc không tham gia lớp học nào");
        }

        List<Class> classes = classRepository.findClassesByStudentId(studentId);
        Date currentDate = new Date();

        return classes.stream()
                .map(classEntity -> {
                    if (classEntity.getCourse() == null) {
                        throw new NotFoundException("Lớp học " + classEntity.getClassCode() + " không có khóa học liên kết");
                    }

                    List<Lecture> lectures = lectureRepository.findByClass1Id(classEntity.getId());
                    int totalLectures = lectures.size();

                    List<Lecture> pastLectures = lectureRepository.findByClassIdAndEndTimeBeforeOrEqual(
                            classEntity.getId(), currentDate);
                    int pastLectureCount = pastLectures.size();

                    int completionPercentage = 0;
                    if (totalLectures > 0) {
                        double percentage = ((double) pastLectureCount / totalLectures) * 100;
                        completionPercentage = (int) Math.round(percentage);
                    }

                    return new LearningProcessDTO(
                            classEntity.getId(),
                            classEntity.getClassCode(),
                            classEntity.getCourse().getCourseName(),
                            classEntity.getCourse().getCourseCode(),
                            completionPercentage
                    );
                })
                .collect(Collectors.toList());
    }

    public List<ClassDTO> searchClassOfStudentOrLecturer(String keyword, int userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        return classRepository.searchClassesByUserIdAndKeyword(userId, keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ClassDTO mapToDTO(Class classEntity) {
        int classUserId = 0;
        Optional<ClassUser> teacherClassUser = classUserRepository.findByClassId(classEntity.getId()).stream()
                .filter(cu -> "LECTURER".equals(cu.getUser().getRole().getName()))
                .findFirst();
        if (teacherClassUser.isPresent()) {
            classUserId = teacherClassUser.get().getUser().getId();
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