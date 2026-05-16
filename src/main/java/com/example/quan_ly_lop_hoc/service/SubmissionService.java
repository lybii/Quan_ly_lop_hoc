package com.example.quan_ly_lop_hoc.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.quan_ly_lop_hoc.dto.SubmissionRequest;
import com.example.quan_ly_lop_hoc.dto.SubmissionResponse;
import com.example.quan_ly_lop_hoc.entity.Assignment;
import com.example.quan_ly_lop_hoc.entity.Submission;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.AssignmentRepository;
import com.example.quan_ly_lop_hoc.repository.SubmissionRepository;
import com.example.quan_ly_lop_hoc.repository.UserRepository;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    private SubmissionResponse convertToResponse(Submission submission) {
        return new SubmissionResponse(
            submission.getId(),
            submission.getFile(),
            submission.getSubmissionTime(),
            submission.getStatus(),
            submission.getGrade(),
            submission.getUser() != null ? submission.getUser().getId() : 0,
            submission.getAssignment() != null ? submission.getAssignment().getId() : 0
        );
    }

    // Add
    public SubmissionResponse addSubmission(SubmissionRequest request, User currentUser) {
        // Chỉ cho phép người dùng có ID = 1 nộp bài
        if (currentUser.getId() != 1) {
            throw new RuntimeException("Bạn không có quyền nộp bài");
        }

        Submission submission = new Submission();
        submission.setFile(request.getFile());
        submission.setSubmissionTime(request.getSubmissionTime());
        submission.setStatus(request.getStatus());
        submission.setGrade(request.getGrade());

        // Gán người dùng (sinh viên)
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        submission.setUser(user);

        // Gán bài tập
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        submission.setAssignment(assignment);

        Submission savedSubmission = submissionRepository.save(submission);
        return convertToResponse(savedSubmission);
    }

    //Update
    public SubmissionResponse updateSubmission(int id, SubmissionRequest request, User currentUser) {
    // Chỉ user là chính mình mới được phép cập nhật submission của họ
    Submission submission = submissionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp với ID: " + id));

    if (currentUser.getId() != 1) {
            throw new RuntimeException("Bạn không có quyền nộp bài");
        }

    submission.setFile(request.getFile());
    submission.setSubmissionTime(request.getSubmissionTime());
    submission.setStatus(request.getStatus());
    submission.setGrade(request.getGrade());

    // Cập nhật người dùng nếu cần
    if (request.getUserId() != null) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        submission.setUser(user);
    }

    // Cập nhật bài tập nếu cần
    if (request.getAssignmentId() != null) {
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));
        submission.setAssignment(assignment);
    }

    Submission updatedSubmission = submissionRepository.save(submission);
    return convertToResponse(updatedSubmission);
    }

    //Delete
    public void deleteSubmission(int id, User currentUser) {
    if (currentUser.getId() != 1) {
        throw new RuntimeException("Bạn không có quyền xóa bài nộp");
    }

    Submission submission = submissionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp với ID: " + id));

    submissionRepository.delete(submission);
    }

    //Lấy danh sách
    public List<SubmissionResponse> getAllSubmissionsByAssignmentId(int assignmentId) {
    Assignment assignment = assignmentRepository.findById(assignmentId)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + assignmentId));

    List<Submission> submissions = submissionRepository.findByAssignment(assignment);
    return submissions.stream().map(this::convertToResponse).toList();
    }

    //Lấy chi tiết
    public SubmissionResponse getSubmissionById(int id) {
    Submission submission = submissionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp với ID: " + id));

    return convertToResponse(submission);
    }

    //Chấm điểm
    public SubmissionResponse updateGrade(int id, SubmissionRequest request, User currentUser) {
    // Chỉ teacher mới có quyền chấm điểm
    if (currentUser.getId() != 1) {
        throw new RuntimeException("Bạn không có quyền chấm điểm bài nộp");
    }

    // Tìm submission theo ID
    Submission submission = submissionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp với ID: " + id));

    // Chỉ cập nhật điểm
    submission.setGrade(request.getGrade());

    // Lưu lại bài nộp đã được chấm điểm
    Submission updatedSubmission = submissionRepository.save(submission);

    // Trả về response
    return convertToResponse(updatedSubmission);
    }

}
