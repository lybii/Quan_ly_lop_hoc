// package com.example.quan_ly_lop_hoc;

// import io.jsonwebtoken.security.Keys;
// import java.util.Base64;
// import java.security.Key;

// public class JwtKeyGenerator {
//     public static void main(String[] args) {
//         Key key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
//         String secretKey = Base64.getEncoder().encodeToString(key.getEncoded());
//         System.out.println("Generated JWT Secret Key: " + secretKey);
//     }
// }