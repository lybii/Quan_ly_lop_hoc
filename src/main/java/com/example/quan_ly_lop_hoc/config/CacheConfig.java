package com.example.quan_ly_lop_hoc.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        System.out.println("✅ CacheManager initialized with name: userDetailsCache");
        return new ConcurrentMapCacheManager("userDetailsCache");
    }
}