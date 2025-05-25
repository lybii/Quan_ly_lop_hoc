package com.example.quan_ly_lop_hoc.repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.quan_ly_lop_hoc.entity.Assignment;
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    // Tùy chọn: lấy tất cả assignment theo class ID
    public List<Assignment> findByClass1Id(int classId);
    //
    Optional<Assignment> findById(int id);
}
