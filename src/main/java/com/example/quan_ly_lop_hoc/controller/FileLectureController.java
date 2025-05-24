package com.example.quan_ly_lop_hoc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.quan_ly_lop_hoc.dto.FileLectureRequest;
import com.example.quan_ly_lop_hoc.dto.FileLectureResponse;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.service.FileLectureService;

@RestController
@RequestMapping("/api/filelectures")
public class FileLectureController {

    @Autowired
    private FileLectureService fileLectureService;

    // Thêm file bài giảng
    @PostMapping("/add")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    
    public FileLectureResponse addFileLecture(@RequestBody FileLectureRequest request) {
        User currentUser = getCurrentLoggedInUser();
        return fileLectureService.addFileLecture(request, currentUser);
    }

    // Cập nhật file bài giảng
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateFileLecture(@PathVariable int id,
                                            @RequestBody FileLectureRequest request) {
        User currentUser = getCurrentLoggedInUser();
        FileLectureResponse updatedFileLecture = fileLectureService.updateFileLecture(id, request, currentUser);
        return ResponseEntity.ok(updatedFileLecture);
    }

    // Xóa file bài giảng
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteFileLecture(@PathVariable int id) {
        User currentUser = getCurrentLoggedInUser();
        fileLectureService.deleteFileLecture(id, currentUser);
        return ResponseEntity.ok("Xóa file bài giảng thành công");
    }

    // Lấy danh sách file bài giảng theo lectureId
    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<FileLectureResponse>> getAllFileLecturesByLectureId(@PathVariable int lectureId) {
        List<FileLectureResponse> files = fileLectureService.getAllFileLecturesByLectureId(lectureId);
        return ResponseEntity.ok(files);
    }

    // Lấy chi tiết file bài giảng theo id
    @GetMapping("/{id}")
    public ResponseEntity<FileLectureResponse> getFileLectureById(@PathVariable int id) {
        FileLectureResponse fileLecture = fileLectureService.getFileLectureById(id);
        return ResponseEntity.ok(fileLecture);
    }

    // Lấy user hiện tại (tạm hardcode admin)
    private User getCurrentLoggedInUser() {
        User user = new User();
        user.setId(3); // Hardcode user có quyền admin
        return user;
    }
}
