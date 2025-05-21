package com.example.quan_ly_lop_hoc.config;

import com.example.quan_ly_lop_hoc.payload.ResponseData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        ResponseData responseData = new ResponseData(401, false, "Token không hợp lệ hoặc đã hết hạn", null);
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getWriter(), responseData);
    }
}
//lỗi token không hợp lệ hoặc trong blacklist trả về HTTP 401/403 mặc định