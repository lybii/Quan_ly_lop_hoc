package com.example.quan_ly_lop_hoc.service;

import com.example.quan_ly_lop_hoc.dto.CommentDTO;
import com.example.quan_ly_lop_hoc.payload.request.CommentRequest;
import com.example.quan_ly_lop_hoc.entity.Assignment;
import com.example.quan_ly_lop_hoc.entity.Comment;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.AssignmentRepository;
import com.example.quan_ly_lop_hoc.repository.CommentRepository;
import com.example.quan_ly_lop_hoc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    public CommentDTO addComment(CommentRequest request) {
        // Kiểm tra dữ liệu đầu vào
        if (request.getUserId() == null || request.getAssignmentId() == null || request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Dữ liệu đầu vào không hợp lệ");
        }

        // Kiểm tra user và assignment
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Bài tập không tồn tại"));

        // Tạo và lưu bình luận
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTime(new Date());
        comment.setStatus(1);
        comment.setUser(user);
        comment.setAssignment(assignment);

        Comment savedComment = commentRepository.save(comment);
        return mapToDTO(savedComment);
    }

    public CommentDTO updateComment(int commentId, CommentRequest request) {
        // Kiểm tra dữ liệu đầu vào
        if (request.getUserId() == null || request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Dữ liệu đầu vào không hợp lệ");
        }

        // Tìm và kiểm tra bình luận
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Bình luận không tồn tại"));

        // Kiểm tra user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Cập nhật và lưu
        comment.setContent(request.getContent());
        comment.setTime(new Date());
        comment.setUser(user);
        Comment savedComment = commentRepository.save(comment);
        return mapToDTO(savedComment);
    }

    public void deleteComment(int commentId) {
        // Tìm và kiểm tra bình luận
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Bình luận không tồn tại"));

        // Xóa mềm
        comment.setStatus(0);
        commentRepository.save(comment);
    }

    public List<CommentDTO> getCommentsOfAssignment(int assignmentId) {
        // Kiểm tra assignment
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Bài tập không tồn tại"));

        // Lấy danh sách bình luận active
        return commentRepository.findByAssignmentId(assignmentId).stream()
                .filter(comment -> comment.getStatus() == 1)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private CommentDTO mapToDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getTime(),
                comment.getUser().getUserName()
        );
    }
}