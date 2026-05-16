package com.example.quan_ly_lop_hoc.utils;

import com.example.quan_ly_lop_hoc.config.JwtProperties;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import javax.crypto.SecretKey;
import java.util.Set;
import java.util.HashSet;

@Component
public class JwtUtilsHelper {
    private final JwtProperties jwtProperties;

    public JwtUtilsHelper(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    private Set<String> blacklistedTokens = new HashSet<>();

    public String generateToken(String data) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.getPrivateKey()));
        return Jwts.builder().setSubject(data).signWith(key).compact();
    }

    public boolean verifyToken(String token) {
        try {
            if (blacklistedTokens.contains(token)) {
                return false;
            }
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.getPrivateKey()));
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void addTokenToBlacklist(String token) {
        blacklistedTokens.add(token);
    }
}
