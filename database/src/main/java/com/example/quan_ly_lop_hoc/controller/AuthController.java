package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.AuthRequest;
import com.example.quan_ly_lop_hoc.dto.AuthResponse;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.payload.ResponseData;
import com.example.quan_ly_lop_hoc.repository.UserRepository;
import com.example.quan_ly_lop_hoc.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, 
                         JwtService jwtService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseData> login(@Valid @RequestBody AuthRequest authRequest) {
        // Xác thực người dùng
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        
        // Tạo token
        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        String token = jwtService.generateToken(userDetails);

        // Lấy thông tin user
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Tạo AuthResponse
        AuthResponse authResponse = new AuthResponse(token, user.getRole().getName(), user.getId());

        // Trả về ResponseData
        ResponseData responseData = new ResponseData(200, true, "Đăng nhập thành công", authResponse);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}