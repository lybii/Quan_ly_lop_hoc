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

import com.example.quan_ly_lop_hoc.dto.AssignmentRequest;
import com.example.quan_ly_lop_hoc.dto.AssignmentResponse;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.service.AssignmentService;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    // Add
    /*@PostMapping("/add")
    public AssignmentResponse addAssignment(@RequestParam String title,
                                            @RequestParam String description,
                                            @RequestParam String file,
                                            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date time,
                                            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date deadline,
                                            @RequestParam int status,
                                            @RequestParam int classId) {

        // Giả định bạn có hàm lấy user hiện tại từ SecurityContext
        User currentUser = getCurrentLoggedInUser(); // hàm giả lập, bạn cần thay bằng thực tế nếu có

        AssignmentRequest request = new AssignmentRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setFile(file);
        request.setTime(time);
        request.setDeadline(deadline);
        request.setStatus(status);
        request.setClassId(classId);

        return assignmentService.addAssignment(request, currentUser);
    }*/

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_LECTURER')")
public AssignmentResponse addAssignment(@RequestBody AssignmentRequest request) {
    // Giả định bạn có hàm lấy user hiện tại từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // hàm giả lập, bạn cần thay bằng thực tế nếu có

    return assignmentService.addAssignment(request, currentUser);
}

    //Update
    /*@PutMapping("/update/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable int id,
                                        @RequestParam String title,
                                        @RequestParam String description,
                                        @RequestParam String file,
                                        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date time,
                                        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date deadline,
                                        @RequestParam Integer status,
                                        @RequestParam int classId) {

    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định

    // Tạo đối tượng AssignmentRequest từ các tham số
    AssignmentRequest request = new AssignmentRequest();
    request.setTitle(title);
    request.setDescription(description);
    request.setFile(file);
    request.setTime(time);
    request.setDeadline(deadline);
    request.setStatus(status);
    request.setClassId(classId);

    // Gọi phương thức updateAssignment từ service và nhận AssignmentResponse
    AssignmentResponse updatedAssignmentResponse = assignmentService.updateAssignment(id, request, currentUser);

    // Trả về AssignmentResponse trong ResponseEntity
    return ResponseEntity.ok(updatedAssignmentResponse);
    }*/

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_LECTURER')")
public ResponseEntity<?> updateAssignment(
        @PathVariable int id,
        @RequestBody AssignmentRequest request) {

    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định

    // Gọi phương thức updateAssignment từ service và nhận AssignmentResponse
    AssignmentResponse updatedAssignmentResponse = assignmentService.updateAssignment(id, request, currentUser);

    // Trả về AssignmentResponse trong ResponseEntity
    return ResponseEntity.ok(updatedAssignmentResponse);
}

    //Delete
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_LECTURER')")
    public ResponseEntity<?> deleteAssignment(@PathVariable int id) {
    // Giả sử bạn đã có thông tin user đăng nhập từ SecurityContext
    User currentUser = getCurrentLoggedInUser(); // Hàm giả định

    // Gọi phương thức deleteAssignment từ service để xóa bài tập
    assignmentService.deleteAssignment(id, currentUser);

    // Trả về thông báo thành công
    return ResponseEntity.ok("Xóa bài tập thành công");
    }

    //Lấy danh sách
    @GetMapping("/assignments/class/{classId}")
    public ResponseEntity<List<AssignmentResponse>> getAllAssignmentsByClassId(@PathVariable int classId) {
    // Gọi service để lấy danh sách các bài tập của lớp học
    List<AssignmentResponse> assignments = assignmentService.getAllAssignmentsByClassId(classId);

    // Trả về danh sách các bài tập dưới dạng ResponseEntity
    return ResponseEntity.ok(assignments);
    }

    //Lấy chi tiết
    @GetMapping("/assignments/{id}")
    public ResponseEntity<AssignmentResponse> getAssignmentById(@PathVariable int id) {
    // Gọi service để lấy bài tập theo ID
    AssignmentResponse assignmentResponse = assignmentService.getAssignmentById(id);

    // Trả về bài tập dưới dạng ResponseEntity
    return ResponseEntity.ok(assignmentResponse);
    }

    //Kiểm tra bài tập còn hạn không
    @PreAuthorize("hasRole('ROLE_LECTURER')")
    @PutMapping("/update-status")
    public ResponseEntity<String> updateAllAssignmentStatuses() {
    assignmentService.updateAssignmentStatus();
    return ResponseEntity.ok("Đã cập nhật trạng thái tất cả bài tập.");
    }

    // Triển khai lấy user hiện tại từ session hoặc token
    private User getCurrentLoggedInUser() {
        User user = new User();
        user.setId(3); // Tạm thời hard-code là Admin
        return user;
    }

}
