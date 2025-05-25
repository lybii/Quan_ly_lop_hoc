package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.dto.CommentDTO;
import com.example.quan_ly_lop_hoc.payload.ResponseData;
import com.example.quan_ly_lop_hoc.payload.request.CommentRequest;
import com.example.quan_ly_lop_hoc.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PreAuthorize("hasAnyRole('ROLE_STUDENT', 'ROLE_LECTURER')")
    @PostMapping
    public ResponseEntity<ResponseData> addComment(@RequestBody CommentRequest request) {
        CommentDTO savedComment = commentService.addComment(request);
        ResponseData responseData = new ResponseData(200, true, "Thêm bình luận thành công", savedComment);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STUDENT', 'ROLE_LECTURER')")
    @PutMapping("/{commentId}")
    public ResponseEntity<ResponseData> updateComment(@PathVariable int commentId, @RequestBody CommentRequest request) {
        CommentDTO updatedComment = commentService.updateComment(commentId, request);
        ResponseData responseData = new ResponseData(200, true, "Cập nhật bình luận thành công", updatedComment);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STUDENT', 'ROLE_LECTURER')")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ResponseData> deleteComment(@PathVariable int commentId) {
        commentService.deleteComment(commentId);
        ResponseData responseData = new ResponseData(200, true, "Xóa bình luận thành công", null);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_STUDENT', 'ROLE_LECTURER')")
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<ResponseData> getCommentsOfAssignment(@PathVariable int assignmentId) {
        List<CommentDTO> comments = commentService.getCommentsOfAssignment(assignmentId);
        ResponseData responseData = new ResponseData(200, true, "Lấy danh sách bình luận thành công", comments);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}