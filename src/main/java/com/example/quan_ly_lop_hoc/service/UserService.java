package com.example.quan_ly_lop_hoc.service;

import com.example.quan_ly_lop_hoc.dto.RoleDTO;
import com.example.quan_ly_lop_hoc.dto.UserDTO;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.UserInterface;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserInterface userRepository;
    private final ModelMapper modelMapper;
    private final BlacklistService blacklistService;

    @Autowired
    public UserService(UserInterface userRepository, ModelMapper modelMapper, BlacklistService blacklistService) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.blacklistService = blacklistService;
    }

    public List<UserDTO> getAllStudents() {
        List<User> students = userRepository.findByRoleId(1);
        return students.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllLecturers() {
        List<User> lecturers = userRepository.findByRoleId(2);
        return lecturers.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getAllAdmins() {
        List<User> admins = userRepository.findByRoleId(3);
        return admins.stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUser(int userId) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        return convertToUserDTO(user);
    }

    public void logout(String token) {
        blacklistService.blacklistToken(token);
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        // Tùy chỉnh RoleDTO để tránh lazy loading
        RoleDTO roleDTO = new RoleDTO(user.getRole().getId(), user.getRole().getName());
        userDTO.setRole(roleDTO);
        return userDTO;
    }
}