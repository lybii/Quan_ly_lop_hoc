package com.example.quan_ly_lop_hoc.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.quan_ly_lop_hoc.dto.LectureRequest;
import com.example.quan_ly_lop_hoc.dto.LectureResponse;
import com.example.quan_ly_lop_hoc.entity.Class;
import com.example.quan_ly_lop_hoc.entity.Lecture;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.ClassRepository;
import com.example.quan_ly_lop_hoc.repository.LectureRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.time.DayOfWeek;

import java.util.Comparator;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



@Service
public class LectureService {

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private ClassRepository classRepository;

    private LectureResponse convertToResponse(Lecture lecture) {
    return new LectureResponse(
        lecture.getId(),
        lecture.getTitle(),
        lecture.getDescription(),
        lecture.getFile(),
        lecture.getStartTime(),
        lecture.getEndTime(),
        lecture.getStatus(),
        lecture.getClass1() != null ? lecture.getClass1().getId() : null
    );
}


    public LectureResponse addLecture(LectureRequest request, User currentUser) {
    if (currentUser.getId() != 3) {
        throw new RuntimeException("Bạn không có quyền thêm buổi học");
    }


    Lecture lecture = new Lecture();
    lecture.setTitle(request.getTitle());
    lecture.setDescription(request.getDescription());
    lecture.setFile(request.getFile());
    lecture.setStartTime(request.getStartTime());
    lecture.setEndTime(request.getEndTime());
    lecture.setStatus(1);


    if (request.getClassId() != null) {
        Class classEntity = classRepository.findById(request.getClassId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        lecture.setClass1(classEntity);
    }


    Lecture savedLecture = lectureRepository.save(lecture);
    return convertToResponse(savedLecture);
}


//Update
    public LectureResponse updateLecture(int id, LectureRequest request, User currentUser) {
        if (currentUser.getId() != 3) {
            throw new RuntimeException("Bạn không có quyền cập nhật buổi học");
        }


        Optional<Lecture> optionalLecture = lectureRepository.findById(id);
        if (optionalLecture.isEmpty()) {
            throw new RuntimeException("Không tìm thấy buổi học với ID: " + id);
        }


        Lecture lecture = optionalLecture.get();
        lecture.setTitle(request.getTitle());
        lecture.setDescription(request.getDescription());
        lecture.setFile(request.getFile());
        lecture.setStartTime(request.getStartTime());
        lecture.setEndTime(request.getEndTime());
        lecture.setStatus(request.getStatus());


        // Nếu có classId, cập nhật luôn class
        if (request.getClassId() != null) {
            Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
            lecture.setClass1(classEntity);
        }


        Lecture updatedLecture = lectureRepository.save(lecture);
        return convertToResponse(updatedLecture);
    }


    //Delete
    public void deleteLecture(int id, User currentUser) {
    if (currentUser.getId() != 3) {
            throw new RuntimeException("Bạn không có quyền cập nhật buổi học");
        }

    Lecture lecture = lectureRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học với ID: " + id));

    lectureRepository.delete(lecture);
    }

    //Search
    public List<LectureResponse> searchLecturesByTitle(String title) {
    List<Lecture> lectures = lectureRepository.findByTitleContainingIgnoreCase(title);
    return lectures.stream().map(this::convertToResponse).toList();
    }

    //Danh sách lecture
    public List<LectureResponse> getAllLecturesByClassId(int classId) {
    Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học với ID: " + classId));

    List<Lecture> lectures = lectureRepository.findByClass1(classEntity);
    return lectures.stream().map(this::convertToResponse).toList();
    }

    //Lấy chi tiết
    public LectureResponse getLectureById(int id) {
    Lecture lecture = lectureRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học với ID: " + id));
    
    return convertToResponse(lecture);
    }

    //Xem thời khóa biểu theo thángtháng
    public Map<String, List<LectureResponse>> getMonthlyScheduleByWeeks(int classId, int year, int month) {
    Class classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

    List<Lecture> lectures = lectureRepository.findByClass1(classEntity);

    // Map kết quả: "Tuần 1: 05/05/2025 - 11/05/2025" => List bài học
    Map<String, List<LectureResponse>> scheduleMap = new LinkedHashMap<>();

    LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
    LocalDate firstMonday = firstDayOfMonth.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

    int weekCount = 1;
    LocalDate currentStart = firstMonday;

    while (currentStart.getMonthValue() == month || currentStart.plusDays(6).getMonthValue() == month) {
        LocalDate currentEnd = currentStart.plusDays(6);

        // Lấy các bài học trong khoảng tuần
        Date startDate = java.sql.Date.valueOf(currentStart);
        Date endDate = java.sql.Date.valueOf(currentEnd);

        List<LectureResponse> weeklyLectures = lectures.stream()
            .filter(lecture -> {
                Date startTime = lecture.getStartTime();
                return startTime != null && !startTime.before(startDate) && !startTime.after(endDate);
            })
            .sorted(Comparator.comparing(Lecture::getStartTime))
            .map(this::convertToResponse)
            .toList();

        String label = String.format("Tuần %d: %s - %s",
                weekCount,
                currentStart.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                currentEnd.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        scheduleMap.put(label, weeklyLectures);

        // Qua tuần tiếp theo
        currentStart = currentStart.plusWeeks(1);
        weekCount++;
    }

    return scheduleMap;
}

}
