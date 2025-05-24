package com.example.quan_ly_lop_hoc.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.quan_ly_lop_hoc.dto.AssignmentRequest;
import com.example.quan_ly_lop_hoc.dto.AssignmentResponse;
import com.example.quan_ly_lop_hoc.entity.Assignment;
import com.example.quan_ly_lop_hoc.entity.Class;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.AssignmentRepository;
import com.example.quan_ly_lop_hoc.repository.ClassRepository;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private ClassRepository classRepository;

    // Phương thức chuyển đổi Assignment thành AssignmentResponse
    private AssignmentResponse convertToResponse(Assignment assignment) {
        return new AssignmentResponse(
            assignment.getId(),
            assignment.getTitle(),
            assignment.getDescription(),
            assignment.getTime(),
            assignment.getDeadline(),
            assignment.getFile(),
            assignment.getStatus(),
            assignment.getClass1() != null ? assignment.getClass1().getId() : null
        );
    }

    // Add Assignment
    public AssignmentResponse addAssignment(AssignmentRequest request, User user) {
        Assignment assignment = new Assignment();

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setFile(request.getFile());
        assignment.setTime(request.getTime());
        assignment.setDeadline(request.getDeadline());
        assignment.setStatus(request.getStatus());

        // Lấy lớp từ classId
        Class clazz = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found with id: " + request.getClassId()));
        assignment.setClass1(clazz);

        // Lưu Assignment vào DB
        Assignment saved = assignmentRepository.save(assignment);

        // Chuyển đổi và trả về Response
        return convertToResponse(saved);
    }

    // Update
    public AssignmentResponse updateAssignment(int id, AssignmentRequest request, User currentUser) {
    // Kiểm tra quyền của người dùng
    /*if (currentUser.getId() != 3) {
        throw new RuntimeException("Bạn không có quyền cập nhật bài tập");
    }*/

    // Tìm Assignment theo ID
    Optional<Assignment> optionalAssignment = assignmentRepository.findById(id);
    if (optionalAssignment.isEmpty()) {
        throw new RuntimeException("Không tìm thấy bài tập với ID: " + id);
    }

    // Cập nhật bài tập
    Assignment assignment = optionalAssignment.get();
    assignment.setTitle(request.getTitle());
    assignment.setDescription(request.getDescription());
    assignment.setFile(request.getFile());
    assignment.setTime(request.getTime());
    assignment.setDeadline(request.getDeadline());
    assignment.setStatus(request.getStatus());

    // Nếu có classId, cập nhật luôn class
    if (request.getClassId() != null) {
        Class classEntity = classRepository.findById(request.getClassId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        assignment.setClass1(classEntity);
    }

    // Lưu bài tập đã cập nhật
    Assignment updatedAssignment = assignmentRepository.save(assignment);

    // Trả về phản hồi dưới dạng AssignmentResponse
    return convertToResponse(updatedAssignment);
    }

    //Delete
    public void deleteAssignment(int id, User currentUser) {
    // Kiểm tra quyền của người dùng
    if (currentUser.getId() != 3) {  // Giả sử user có ID = 3 là admin hoặc có quyền
        throw new RuntimeException("Bạn không có quyền xóa bài tập");
    }

    // Tìm bài tập theo ID
    Assignment assignment = assignmentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + id));

    // Xóa bài tập
    assignmentRepository.delete(assignment);
    }

    //Lấy danh sách
    public List<AssignmentResponse> getAllAssignmentsByClassId(int classId) {
    // Lấy danh sách các bài tập dựa trên classId
    List<Assignment> assignments = assignmentRepository.findByClass1Id(classId);
    
    // Chuyển đổi từ Assignment sang AssignmentResponse
    return assignments.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
    }

    //Lấy chi tiết
    public AssignmentResponse getAssignmentById(int id) {
    // Lấy bài tập theo ID
    Assignment assignment = assignmentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + id));
    
    // Chuyển đổi từ Assignment sang AssignmentResponse
    return convertToResponse(assignment);
    }

    //Tự động cập nhật bài tập còn hạn không 
    public void updateAssignmentStatus() {
    List<Assignment> assignments = assignmentRepository.findAll();
    Date now = new Date(); // Thời gian hiện tại

    for (Assignment assignment : assignments) {
        if (assignment.getDeadline() != null) {
            if (now.after(assignment.getDeadline())) {
                assignment.setStatus(0); // Quá hạn
            } else {
                assignment.setStatus(1); // Còn hạn
            }
        }
    }

    assignmentRepository.saveAll(assignments); // Lưu lại tất cả bài tập đã cập nhật
}


}
