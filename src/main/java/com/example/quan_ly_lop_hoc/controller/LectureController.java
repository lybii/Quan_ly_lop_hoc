package com.example.quan_ly_lop_hoc.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.quan_ly_lop_hoc.dto.LectureRequest;
import com.example.quan_ly_lop_hoc.dto.LectureResponse;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.service.LectureService;

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


@RestController
@RequestMapping("/api/lectures")
public class LectureController {

    @Autowired
    private LectureService lectureService;

    /*@PostMapping("/add")
    public LectureResponse addLecture(@RequestParam String title,
                            @RequestParam String description,
                            @RequestParam String file,
                            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date startTime,
                            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date endTime,
                            @RequestParam Integer status,
                            @RequestParam int classId
                            ) {


        // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
        User currentUser = getCurrentLoggedInUser(); // Hàm giả định


        // Tạo đối tượng LectureRequest từ các tham số
        LectureRequest request = new LectureRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setFile(file);
        request.setStartTime(startTime);
        request.setEndTime(endTime);
        request.setStatus(status);
        request.setClassId(classId);


        return lectureService.addLecture(request, currentUser);
    }*/

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
public LectureResponse addLecture(@RequestBody LectureRequest request) {
    User currentUser = getCurrentLoggedInUser();
    return lectureService.addLecture(request, currentUser);
}

    //Update
    /*@PutMapping("/update/{id}")
    public ResponseEntity<?> updateLecture(@PathVariable int id,
                                        @RequestParam String title,
                                        @RequestParam String description,
                                        @RequestParam String file,
                                        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date startTime,
                                        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date endTime,
                                        @RequestParam Integer status,
                                        @RequestParam int classId) {


    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định


    // Tạo đối tượng LectureRequest từ các tham số
    LectureRequest request = new LectureRequest();
    request.setTitle(title);
    request.setDescription(description);
    request.setFile(file); // File nếu có
    request.setStartTime(startTime);
    request.setEndTime(endTime);
    request.setStatus(status);
    request.setClassId(classId);


    // Gọi phương thức updateLecture từ service và nhận LectureResponse
    LectureResponse updatedLectureResponse = lectureService.updateLecture(id, request, currentUser);


    // Trả về LectureResponse trong ResponseEntity
    return ResponseEntity.ok(updatedLectureResponse);
    }*/

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseEntity<?> updateLecture(@PathVariable int id,
                                    @RequestBody LectureRequest request) {
    User currentUser = getCurrentLoggedInUser();
    LectureResponse updatedLectureResponse = lectureService.updateLecture(id, request, currentUser);
    return ResponseEntity.ok(updatedLectureResponse);
}

    //Delete
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteLecture(@PathVariable int id) {
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định như bạn đã dùng
    lectureService.deleteLecture(id, currentUser);
    return ResponseEntity.ok("Xóa buổi học thành công");
    }

    //Search
    @GetMapping("/search")
    public ResponseEntity<List<LectureResponse>> searchLectures(@RequestParam String title) {
    List<LectureResponse> lectures = lectureService.searchLecturesByTitle(title);
    return ResponseEntity.ok(lectures);
    }

    //Danh sách lecture
    @GetMapping("/lectures/class/{classId}")
    public ResponseEntity<List<LectureResponse>> getAllLecturesByClassId(@PathVariable int classId) {
    // Gọi service để lấy danh sách các buổi học của lớp học
    List<LectureResponse> lectures = lectureService.getAllLecturesByClassId(classId);

    // Trả về danh sách các buổi học dưới dạng ResponseEntity
    return ResponseEntity.ok(lectures);
    }

    // Lấy chi tiết
    @GetMapping("/lectures/{id}")
    public ResponseEntity<LectureResponse> getLectureById(@PathVariable int id) {
    LectureResponse lectureResponse = lectureService.getLectureById(id);
    return ResponseEntity.ok(lectureResponse);
    }

    // Triển khai lấy user hiện tại từ session hoặc token
    private User getCurrentLoggedInUser() {
        User user = new User();
        user.setId(3); // Tạm thời hard-code là Admin
        return user;
    }

    //Xem thời khóa biểu theo tháng
    @GetMapping("/schedule/month/{classId}")
public ResponseEntity<Map<String, List<LectureResponse>>> getMonthlySchedule(
        @PathVariable int classId,
        @RequestParam int year,
        @RequestParam int month) {

    Map<String, List<LectureResponse>> result = lectureService.getMonthlyScheduleByWeeks(classId, year, month);
    return ResponseEntity.ok(result);
}

}
