package com.example.quan_ly_lop_hoc.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY = "4subtdpFMN1SV+tzwCWffjlNapmaS2U4FnS6jawgFE8=";

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {
        System.out.println("🔍 Generating token for username: " + userDetails.getUsername());
        Map<String, Object> claims = new HashMap<>();
        String role = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .findFirst()
                .orElse("USER");
        claims.put("role", role);
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 giờ
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            String username = extractClaim(token, Claims::getSubject);
            System.out.println("✅ Extracted Username: " + username);
            return username;
        } catch (Exception e) {
            System.out.println("❌ JWT Invalid: " + e.getMessage());
            return null;
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("❌ Error parsing JWT: " + e.getMessage());
            throw new RuntimeException("Invalid JWT token: " + e.getMessage());
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        if (userDetails == null) {
            System.out.println("❌ ValidateToken - UserDetails is null");
            return false;
        }
        final String username = extractUsername(token);
        boolean usernameMatches = username != null && username.equals(userDetails.getUsername());
        boolean isExpired = isTokenExpired(token);
        boolean isValid = usernameMatches && !isExpired;
        System.out.println("🔍 ValidateToken - Token: " + token + 
                          " | Token username: " + username + 
                          " | UserDetails username: " + userDetails.getUsername() + 
                          " | Username matches: " + usernameMatches + 
                          " | Expired: " + isExpired + 
                          " | Valid: " + isValid);
        return isValid;
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = extractClaim(token, Claims::getExpiration);
            boolean isExpired = expiration.before(new Date());
            System.out.println("🔍 Token expiration check: " + expiration + " | Expired: " + isExpired);
            return isExpired;
        } catch (Exception e) {
            System.out.println("❌ Error checking token expiration: " + e.getMessage());
            return true;
        }
    }
}