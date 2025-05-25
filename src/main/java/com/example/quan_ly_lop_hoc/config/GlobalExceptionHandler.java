package com.example.quan_ly_lop_hoc.config;

import com.example.quan_ly_lop_hoc.exception.NotFoundException;
import com.example.quan_ly_lop_hoc.payload.ResponseData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseData> handleNotFoundException(NotFoundException ex) {
        ResponseData responseData = new ResponseData(404, false, ex.getMessage(), null);
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ResponseData> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = "Tham số không hợp lệ: " + ex.getName() + " phải là kiểu " + ex.getRequiredType().getSimpleName();
        ResponseData responseData = new ResponseData(400, false, message, null);
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ResponseData> handleMissingParams(MissingServletRequestParameterException ex) {
        String message = "Thiếu tham số bắt buộc: " + ex.getParameterName();
        ResponseData responseData = new ResponseData(400, false, message, null);
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData> handleGeneralException(Exception ex) {
        String message = "Lỗi hệ thống: " + ex.getMessage();
        ResponseData responseData = new ResponseData(500, false, message, null);
        return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}