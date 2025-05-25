package com.example.quan_ly_lop_hoc.repository;

import com.example.quan_ly_lop_hoc.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
    boolean existsByToken(String token);
}