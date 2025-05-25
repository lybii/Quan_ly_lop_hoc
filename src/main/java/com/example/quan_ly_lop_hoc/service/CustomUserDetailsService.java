package com.example.quan_ly_lop_hoc.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.example.quan_ly_lop_hoc.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    // @Cacheable(value = "userDetailsCache", key = "#email") // Tạm thời vô hiệu hóa cache
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("🔍 Loading user: " + email);
        try {
            UserDetails user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản với email: " + email));
            System.out.println("✅ Loaded user: " + email + " | Username: " + user.getUsername());
            return user;
        } catch (Exception e) {
            System.out.println("❌ Error loading user: " + email + " | Error: " + e.getMessage());
            throw new UsernameNotFoundException("Không tìm thấy tài khoản với email: " + email, e);
        }
    }
}