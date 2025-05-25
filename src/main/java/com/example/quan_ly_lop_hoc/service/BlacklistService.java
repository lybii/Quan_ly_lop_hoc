package com.example.quan_ly_lop_hoc.service;

import com.example.quan_ly_lop_hoc.entity.BlacklistedToken;
import com.example.quan_ly_lop_hoc.repository.BlacklistedTokenRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BlacklistService {

    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final JwtService jwtService;

    @Autowired
    public BlacklistService(BlacklistedTokenRepository blacklistedTokenRepository, JwtService jwtService) {
        this.blacklistedTokenRepository = blacklistedTokenRepository;
        this.jwtService = jwtService;
    }

    public void blacklistToken(String token) {
        BlacklistedToken blacklistedToken = new BlacklistedToken(token, new Date());
        blacklistedTokenRepository.save(blacklistedToken);
        System.out.println("✅ Token blacklisted: " + token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }

    // Scheduled task để xóa token hết hạn
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Chạy mỗi 24 giờ
    public void cleanExpiredTokens() {
        List<BlacklistedToken> blacklistedTokens = blacklistedTokenRepository.findAll();
        for (BlacklistedToken blacklistedToken : blacklistedTokens) {
            String token = blacklistedToken.getToken();
            try {
                Claims claims = jwtService.extractAllClaims(token);
                Date expiration = claims.getExpiration();
                if (expiration.before(new Date())) {
                    blacklistedTokenRepository.delete(blacklistedToken);
                    System.out.println("🗑️ Removed expired token: " + token);
                }
            } catch (Exception e) {
                // Nếu token không parse được (hỏng hoặc sai định dạng), xóa luôn
                blacklistedTokenRepository.delete(blacklistedToken);
                System.out.println("🗑️ Removed invalid token: " + token + " | Error: " + e.getMessage());
            }
        }
        System.out.println("✅ Cleaned up expired tokens");
    }
}