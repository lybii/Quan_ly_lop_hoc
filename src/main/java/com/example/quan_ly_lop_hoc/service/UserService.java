package com.example.quan_ly_lop_hoc.service;

import com.example.quan_ly_lop_hoc.dto.GradeDTO;
import com.example.quan_ly_lop_hoc.dto.RoleDTO;
import com.example.quan_ly_lop_hoc.dto.UserDTO;
import com.example.quan_ly_lop_hoc.entity.Role;
import com.example.quan_ly_lop_hoc.entity.Submission;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.exception.NotFoundException;
import com.example.quan_ly_lop_hoc.repository.SubmissionRepository;
import com.example.quan_ly_lop_hoc.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final ModelMapper modelMapper;
    private final BlacklistService blacklistService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, SubmissionRepository submissionRepository, ModelMapper modelMapper,
                       BlacklistService blacklistService, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.modelMapper = modelMapper;
        this.blacklistService = blacklistService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllStudents() {
        List<User> students = userRepository.findByRoleId(1); // Giả định roleId = 1 là sinh viên
        return students.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllLecturers() {
        List<User> lecturers = userRepository.findByRoleId(2); // Giả định roleId = 2 là giảng viên
        return lecturers.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllAdmins() {
        List<User> admins = userRepository.findByRoleId(3); // Giả định roleId = 3 là quản trị viên
        return admins.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        return convertToUserDTO(user);
    }

    public List<UserDTO> searchUserByNameOrCode(String keyword) {
        return userRepository.searchByNameOrCode(keyword).stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public void logout(String token) {
        blacklistService.blacklistToken(token);
    }

    public UserDTO updateUser(int userId, String avatar) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        user.setAvatar(avatar);
        user = userRepository.save(user);
        return convertToUserDTO(user);
    }

    public void resetPassword(int userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }

        // Kiểm tra độ mạnh mật khẩu mới
        if (!isStrongPassword(newPassword)) {
            throw new IllegalArgumentException("Mật khẩu mới không đủ mạnh. Yêu cầu: ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<GradeDTO> getAllGrades(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        if (!user.getRole().getName().equals("STUDENT")) {
            throw new IllegalArgumentException("Chỉ sinh viên mới có thể xem điểm");
        }
        return submissionRepository.findByUserId(userId).stream()
                .map(this::mapToGradeDTO)
                .collect(Collectors.toList());
    }

    public UserDTO createAccount(UserDTO userDTO) {
        // Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        User user = modelMapper.map(userDTO, User.class);
        // Đặt mật khẩu mặc định là {code}123
        String defaultPassword = userDTO.getCode() + "123";
        user.setPassword(passwordEncoder.encode(defaultPassword));
        user.setStatus(1); // Mặc định tài khoản hoạt động

        // Lưu user vào database
        user = userRepository.save(user);

        return convertToUserDTO(user);
    }

    public void deleteAccount(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        user.setStatus(0); // Chuyển trạng thái thành khóa
        userRepository.save(user);
    }

    public UserDTO updateAccount(int userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        user.setUserName(userDTO.getUserName());
        user.setEmail(userDTO.getEmail());
        user.setDateOfBirth(userDTO.getDateOfBirth());
        user.setGender(userDTO.getGender());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAvatar(userDTO.getAvatar());
        user.setCode(userDTO.getCode());
        user.setMajor(userDTO.getMajor());
        user.setStatus(userDTO.getStatus());
        Role role = new Role();
        role.setId(userDTO.getRole().getId());
        role.setName(userDTO.getRole().getName());
        user.setRole(role);
        user = userRepository.save(user);
        return convertToUserDTO(user);
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        RoleDTO roleDTO = new RoleDTO(user.getRole().getId(), user.getRole().getName());
        userDTO.setRole(roleDTO);
        return userDTO;
    }

    private GradeDTO mapToGradeDTO(Submission submission) {
        return new GradeDTO(
                submission.getId(),
                submission.getAssignment().getClass1().getCourse().getId(),
                submission.getAssignment().getClass1().getCourse().getCourseName(),
                submission.getGrade()
        );
    }

    private boolean isStrongPassword(String password) {
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        return Pattern.matches(passwordPattern, password);
    }
}