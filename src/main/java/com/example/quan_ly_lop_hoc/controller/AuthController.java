package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.AuthRequest;
import com.example.quan_ly_lop_hoc.dto.AuthResponse;
import com.example.quan_ly_lop_hoc.service.JwtService;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.UserInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserInterface userRepository;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtService jwtService, UserInterface userRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmail(authRequest.getEmail()).orElseThrow();

        return new AuthResponse(token, user.getRole().getName());
    }
}
