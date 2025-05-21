package com.example.quan_ly_lop_hoc.config;

import com.example.quan_ly_lop_hoc.repository.BlacklistedTokenRepository;
import com.example.quan_ly_lop_hoc.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService, 
                                   BlacklistedTokenRepository blacklistedTokenRepository) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.blacklistedTokenRepository = blacklistedTokenRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        // Bỏ qua xác thực cho các endpoint permitAll
        if (requestURI.equals("/auth/login")) {
            System.out.println("🔍 Skipping authentication for: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        System.out.println("🔍 Checking Authorization header: " + authHeader + " | URI: " + requestURI);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("🔍 Token: " + token);

        // Kiểm tra token có trong danh sách đen không
        if (blacklistedTokenRepository.existsByToken(token)) {
            System.out.println("❌ Token is blacklisted");
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtService.extractUsername(token);
        System.out.println("🔍 Extracted Username: " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("🔍 UserDetails username: " + (userDetails != null ? userDetails.getUsername() : "null"));
                boolean isTokenValid = jwtService.validateToken(token, userDetails);
                System.out.println("🔍 Token valid: " + isTokenValid);

                if (isTokenValid) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Authentication set for user: " + username);
                } else {
                    System.out.println("❌ Token invalid");
                }
            } catch (Exception e) {
                System.out.println("❌ Error loading UserDetails or validating token: " + e.getMessage());
            }
        } else {
            System.out.println("🔍 Skipping authentication: username=" + username + 
                              ", existing authentication=" + SecurityContextHolder.getContext().getAuthentication());
        }
        filterChain.doFilter(request, response);
    }
}