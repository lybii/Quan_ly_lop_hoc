package com.example.quan_ly_lop_hoc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.quan_ly_lop_hoc")
public class QuanLyLopHocApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuanLyLopHocApplication.class, args);
	}

}
