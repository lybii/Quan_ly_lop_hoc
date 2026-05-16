package com.example.quan_ly_lop_hoc.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/protected-endpoint")
    public String protectedEndpoint() {
        return "This is a protected endpoint!";
    }
}