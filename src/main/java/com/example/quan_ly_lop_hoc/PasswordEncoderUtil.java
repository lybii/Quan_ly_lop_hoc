package com.example.quan_ly_lop_hoc;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "123456hyetdvanb7&hdgf"; // Mật khẩu gốc
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println(encodedPassword);
    }
}