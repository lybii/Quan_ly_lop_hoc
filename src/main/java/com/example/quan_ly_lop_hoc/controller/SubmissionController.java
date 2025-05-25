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

import com.example.quan_ly_lop_hoc.dto.SubmissionRequest;
import com.example.quan_ly_lop_hoc.dto.SubmissionResponse;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.service.SubmissionService;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    // Add
    /*@PostMapping("/add")
    public SubmissionResponse addSubmission(
            @RequestParam String file,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date submissionTime,
            @RequestParam Integer status,
            @RequestParam float grade,
            @RequestParam Integer userId,
            @RequestParam Integer assignmentId
    ) {

        // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
        User currentUser = getCurrentLoggedInUser(); // Hàm giả định

        // Tạo đối tượng SubmissionRequest từ các tham số
        SubmissionRequest request = new SubmissionRequest();
        request.setFile(file);
        request.setSubmissionTime(submissionTime);
        request.setStatus(status);
        request.setGrade(grade);
        request.setUserId(userId);
        request.setAssignmentId(assignmentId);

        return submissionService.addSubmission(request, currentUser);
    }*/

    @PostMapping("/add")
public SubmissionResponse addSubmission(@RequestBody SubmissionRequest request) {

    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định

    return submissionService.addSubmission(request, currentUser);
}


    //Update
    /*@PutMapping("/update/{id}")
    public ResponseEntity<?> updateSubmission(
        @PathVariable int id,
        @RequestParam String file,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date submissionTime,
        @RequestParam Integer status,
        @RequestParam(required = false) float grade,
        @RequestParam Integer userId,
        @RequestParam Integer assignmentId) {

    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định

    // Tạo SubmissionRequest từ các tham số
    SubmissionRequest request = new SubmissionRequest();
    request.setFile(file);
    request.setSubmissionTime(submissionTime);
    request.setStatus(status);
    request.setGrade(grade);
    request.setUserId(userId);
    request.setAssignmentId(assignmentId);

    // Gọi service để cập nhật
    SubmissionResponse updatedSubmission = submissionService.updateSubmission(id, request, currentUser);

    return ResponseEntity.ok(updatedSubmission);
    }*/

    @PutMapping("/update/{id}")
public ResponseEntity<?> updateSubmission(
    @PathVariable int id,
    @RequestBody SubmissionRequest request) {

    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định

    // Gọi service để cập nhật
    SubmissionResponse updatedSubmission = submissionService.updateSubmission(id, request, currentUser);

    return ResponseEntity.ok(updatedSubmission);
}


    //Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSubmission(@PathVariable int id) {
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định như bạn đã dùng
    submissionService.deleteSubmission(id, currentUser);
    return ResponseEntity.ok("Xóa bài nộp thành công");
    }

    //Lấy danh sách
    @GetMapping("/submissions/assignment/{assignmentId}")
    public ResponseEntity<List<SubmissionResponse>> getAllSubmissionsByAssignmentId(@PathVariable int assignmentId) {
    List<SubmissionResponse> submissions = submissionService.getAllSubmissionsByAssignmentId(assignmentId);
    return ResponseEntity.ok(submissions);
    }

    //Lấy chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmissionById(@PathVariable int id) {
    SubmissionResponse submissionResponse = submissionService.getSubmissionById(id);
    return ResponseEntity.ok(submissionResponse);
    }

    //Chấm điểm
    /*@PutMapping("/grade/{id}")
    public ResponseEntity<?> updateGrade(@PathVariable int id, @RequestParam float grade) {
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định để lấy user hiện tại

    SubmissionRequest request = new SubmissionRequest();
    request.setGrade(grade);

    SubmissionResponse updatedSubmission = submissionService.updateGrade(id, request, currentUser);

    return ResponseEntity.ok(updatedSubmission);
    }*/

    @PutMapping("/grade/{id}")
    @PreAuthorize("hasRole('ROLE_LECTURER')")
public ResponseEntity<?> updateGrade(@PathVariable int id, @RequestBody SubmissionRequest request) {
    User currentUser = getCurrentLoggedInUser(); // Lấy user hiện tại

    SubmissionResponse updatedSubmission = submissionService.updateGrade(id, request, currentUser);

    return ResponseEntity.ok(updatedSubmission);
}



    // Triển khai lấy user hiện tại từ session hoặc token
    private User getCurrentLoggedInUser() {
        User user = new User();
        user.setId(1);
        return user;
    }
}