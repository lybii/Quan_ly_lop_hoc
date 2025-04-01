package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.UserDTO;
import com.example.quan_ly_lop_hoc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/students")
    public ResponseEntity<List<UserDTO>> getAllStudents() {
        List<UserDTO> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'LECTURER')")
    @GetMapping("/lecturers")
    public ResponseEntity<List<UserDTO>> getAllLecturers() {
        List<UserDTO> lecturers = userService.getAllLecturers();
        return ResponseEntity.ok(lecturers);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admins")
    public ResponseEntity<List<UserDTO>> getAllAdmins() {
        List<UserDTO> admins = userService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    @PreAuthorize("isAuthenticated()") // Chỉ cần đăng nhập là đủ
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable int userId) {
        UserDTO user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid or missing token");
        }
        String token = authHeader.substring(7);
        userService.logout(token);
        return ResponseEntity.ok("Logged out successfully");
    }
}