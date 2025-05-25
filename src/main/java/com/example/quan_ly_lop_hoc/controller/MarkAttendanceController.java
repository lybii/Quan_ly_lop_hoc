package com.example.quan_ly_lop_hoc.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.quan_ly_lop_hoc.dto.MarkAttendanceRequest;
import com.example.quan_ly_lop_hoc.dto.MarkAttendanceResponse;
import com.example.quan_ly_lop_hoc.service.MarkAttendanceService;

@RestController
@RequestMapping("/api/attendances")
@PreAuthorize("hasRole('ROLE_LECTURER')")
public class MarkAttendanceController {

    private final MarkAttendanceService markAttendanceService;

    public MarkAttendanceController(MarkAttendanceService markAttendanceService) {
        this.markAttendanceService = markAttendanceService;
    }

    // Thêm điểm danh (POST /api/attendances/add)
    @PostMapping("/add")
    public ResponseEntity<MarkAttendanceResponse> addAttendance(@RequestBody MarkAttendanceRequest request) {
        MarkAttendanceResponse response = markAttendanceService.addAttendance(request);
        return ResponseEntity.ok(response);
    }

    // Cập nhật status điểm danh (PATCH /api/attendances/status/{id}?status=x)
    @PutMapping("/status/{id}")
    public ResponseEntity<MarkAttendanceResponse> updateAttendanceStatus(
            @PathVariable("id") Integer attendanceId,
            @RequestParam Integer status) {
        Optional<MarkAttendanceResponse> updated = markAttendanceService.updateAttendanceStatus(attendanceId, status);
        return updated.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Lấy danh sách điểm danh theo lectureId (GET /api/attendances/by-lecture/{lectureId})
    @GetMapping("/by-lecture/{lectureId}")
    public ResponseEntity<List<MarkAttendanceResponse>> getAttendancesByLecture(@PathVariable Integer lectureId) {
        List<MarkAttendanceResponse> responses = markAttendanceService.getAttendancesByLecture(lectureId);
        return ResponseEntity.ok(responses);
    }

    // Lấy điểm danh theo id (GET /api/attendances/{id})
    @GetMapping("/{id}")
    public ResponseEntity<MarkAttendanceResponse> getAttendanceById(@PathVariable("id") Integer attendanceId) {
        Optional<MarkAttendanceResponse> response = markAttendanceService.getAttendanceById(attendanceId);
        return response.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
