package com.example.quan_ly_lop_hoc.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.quan_ly_lop_hoc.dto.MarkAttendanceRequest;
import com.example.quan_ly_lop_hoc.dto.MarkAttendanceResponse;
import com.example.quan_ly_lop_hoc.dto.UserDTO;
import com.example.quan_ly_lop_hoc.dto.LectureResponse;
import com.example.quan_ly_lop_hoc.dto.RoleDTO;

import com.example.quan_ly_lop_hoc.entity.MarkAttendance;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.entity.Lecture;
import com.example.quan_ly_lop_hoc.entity.Role;

import com.example.quan_ly_lop_hoc.repository.MarkAttendanceRepository;
import com.example.quan_ly_lop_hoc.repository.UserRepository;
import com.example.quan_ly_lop_hoc.repository.LectureRepository;

@Service
public class MarkAttendanceService {

    private final MarkAttendanceRepository markAttendanceRepository;
    private final UserRepository userRepository;
    private final LectureRepository lectureRepository;

    public MarkAttendanceService(MarkAttendanceRepository markAttendanceRepository,
                                 UserRepository userRepository,
                                 LectureRepository lectureRepository) {
        this.markAttendanceRepository = markAttendanceRepository;
        this.userRepository = userRepository;
        this.lectureRepository = lectureRepository;
    }

    private MarkAttendanceResponse convertToResponse(MarkAttendance attendance) {
    MarkAttendanceResponse response = new MarkAttendanceResponse();

    response.setId(attendance.getId());
    response.setTime(attendance.getTime());
    response.setStatus(attendance.getStatus());

    // Chỉ set userId và userName
    User user = attendance.getUser();
    response.setUserId(user.getId());
    response.setUserName(user.getUserName());

    // Chỉ set lectureId và lectureTitle
    Lecture lecture = attendance.getLecture();
    response.setLectureId(lecture.getId());
    response.setLectureTitle(lecture.getTitle());

    return response;
}

    public MarkAttendanceResponse addAttendance(MarkAttendanceRequest request) {
        MarkAttendance attendance = new MarkAttendance();
        attendance.setTime(new Date());
        attendance.setStatus(request.getStatus());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));
        Lecture lecture = lectureRepository.findById(request.getLectureId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học với ID: " + request.getLectureId()));

        attendance.setUser(user);
        attendance.setLecture(lecture);

        MarkAttendance saved = markAttendanceRepository.save(attendance);
        return convertToResponse(saved);
    }

    public Optional<MarkAttendanceResponse> updateAttendanceStatus(Integer attendanceId, Integer status) {
        return markAttendanceRepository.findById(attendanceId)
                .map(attendance -> {
                    attendance.setStatus(status);
                    markAttendanceRepository.save(attendance);
                    return convertToResponse(attendance);
                });
    }

    public List<MarkAttendanceResponse> getAttendancesByLecture(Integer lectureId) {
        return markAttendanceRepository.findByLectureId(lectureId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<MarkAttendanceResponse> getAttendanceById(Integer attendanceId) {
        return markAttendanceRepository.findById(attendanceId)
                .map(this::convertToResponse);
    }
}
