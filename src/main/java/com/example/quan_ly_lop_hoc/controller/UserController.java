package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.GradeDTO;
import com.example.quan_ly_lop_hoc.dto.UserDTO;
import com.example.quan_ly_lop_hoc.payload.ResponseData;
import com.example.quan_ly_lop_hoc.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Lấy tất cả sinh viên (admin)
    @GetMapping("/students")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getAllStudents() {
        List<UserDTO> students = userService.getAllStudents();
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách sinh viên thành công", students);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy tất cả giảng viên (admin)
    @GetMapping("/lecturers")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getAllLecturers() {
        List<UserDTO> lecturers = userService.getAllLecturers();
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách giảng viên thành công", lecturers);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy tất cả quản trị viên (admin)
    @GetMapping("/admins")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getAllAdmins() {
        List<UserDTO> admins = userService.getAllAdmins();
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách quản trị viên thành công", admins);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy tất cả người dùng (admin)
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách người dùng thành công", users);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy thông tin người dùng theo ID (user)
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseData> getUser(@PathVariable int userId) {
        UserDTO user = userService.getUser(userId);
        ResponseData responseData = new ResponseData(200, true, "Lấy thông tin người dùng thành công", user);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Tìm kiếm người dùng theo tên hoặc mã (admin)
    @GetMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> searchUserByNameOrCode(@RequestParam String keyword) {
        List<UserDTO> users = userService.searchUserByNameOrCode(keyword);
        ResponseData responseData = new ResponseData(200, true, "Tìm kiếm người dùng thành công", users);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Đăng xuất (user)
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseData> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            ResponseData responseData = new ResponseData(400, false, "Invalid or missing token", null);
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        String token = authHeader.substring(7);
        userService.logout(token);
        ResponseData responseData = new ResponseData(200, true, "Đăng xuất thành công", null);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Cập nhật avatar (user)
    @PutMapping("/{userId}/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseData> updateUser(@PathVariable int userId, @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(userId, userDTO.getAvatar());
        ResponseData responseData = new ResponseData(200, true, "Cập nhật avatar thành công", updatedUser);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Đổi mật khẩu (user)
    @PutMapping("/{userId}/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseData> resetPassword(@PathVariable int userId, @RequestBody PasswordChangeRequest request) {
        userService.resetPassword(userId, request.getOldPassword(), request.getNewPassword());
        ResponseData responseData = new ResponseData(200, true, "Đổi mật khẩu thành công", null);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Lấy điểm tất cả môn của sinh viên (student)
    @GetMapping("/{userId}/grades")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<ResponseData> getAllGrades(@PathVariable int userId) {
        List<GradeDTO> grades = userService.getAllGrades(userId);
        ResponseData responseData = new ResponseData(200, true, "Lấy điểm các môn thành công", grades);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Tạo tài khoản mới (admin)
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> createAccount(@Valid @RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.createAccount(userDTO);
        ResponseData responseData = new ResponseData(200, true, "Tạo tài khoản thành công", createdUser);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Xóa tài khoản (admin)
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> deleteAccount(@PathVariable int userId) {
        userService.deleteAccount(userId);
        ResponseData responseData = new ResponseData(200, true, "Xóa tài khoản thành công", null);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Cập nhật thông tin tài khoản (admin)
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseData> updateAccount(@PathVariable int userId, @Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateAccount(userId, userDTO);
        ResponseData responseData = new ResponseData(200, true, "Cập nhật tài khoản thành công", updatedUser);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // DTO nội bộ cho đổi mật khẩu
    private static class PasswordChangeRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}