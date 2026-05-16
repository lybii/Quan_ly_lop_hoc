package com.example.quan_ly_lop_hoc.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.quan_ly_lop_hoc.dto.FileLectureRequest;
import com.example.quan_ly_lop_hoc.dto.FileLectureResponse;
import com.example.quan_ly_lop_hoc.entity.FileLecture;
import com.example.quan_ly_lop_hoc.entity.Lecture;
import com.example.quan_ly_lop_hoc.entity.User;
import com.example.quan_ly_lop_hoc.repository.FileLectureRepository;
import com.example.quan_ly_lop_hoc.repository.LectureRepository;

@Service
public class FileLectureService {

    @Autowired
    private FileLectureRepository fileLectureRepository;

    @Autowired
    private LectureRepository lectureRepository;


    private FileLectureResponse convertToResponse(FileLecture fileLecture) {
        return new FileLectureResponse(
            fileLecture.getId(),
            fileLecture.getFile(),
            fileLecture.getStatus(),
            fileLecture.getLecture() != null ? fileLecture.getLecture().getId() : null
        );
    }

    // Thêm mới fileLecture
    public FileLectureResponse addFileLecture(FileLectureRequest request, User currentUser) {
        if (currentUser.getId() != 3) {
            throw new RuntimeException("Bạn không có quyền thêm file bài giảng");
        }

        FileLecture fileLecture = new FileLecture();
        fileLecture.setFile(request.getFile());
        fileLecture.setStatus(1);

        if (request.getLectureId() != null) {
            Lecture lecture = lectureRepository.findById(request.getLectureId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học"));
            fileLecture.setLecture(lecture);
        }

        FileLecture saved = fileLectureRepository.save(fileLecture);
        return convertToResponse(saved);
    }

    // Cập nhật fileLecture
    public FileLectureResponse updateFileLecture(int id, FileLectureRequest request, User currentUser) {
        if (currentUser.getId() != 3) {
            throw new RuntimeException("Bạn không có quyền cập nhật file bài giảng");
        }

        FileLecture fileLecture = fileLectureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy file bài giảng với ID: " + id));

        fileLecture.setFile(request.getFile());
        fileLecture.setStatus(request.getStatus());

        if (request.getLectureId() != null) {
            Lecture lecture = lectureRepository.findById(request.getLectureId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học"));
            fileLecture.setLecture(lecture);
        }

        FileLecture updated = fileLectureRepository.save(fileLecture);
        return convertToResponse(updated);
    }

    // Xóa fileLecture
    public void deleteFileLecture(int id, User currentUser) {
        if (currentUser.getId() != 3) {
            throw new RuntimeException("Bạn không có quyền xóa file bài giảng");
        }

        FileLecture fileLecture = fileLectureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy file bài giảng với ID: " + id));

        fileLectureRepository.delete(fileLecture);
    }

    public List<FileLectureResponse> getAllFileLecturesByLectureId(int lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học với ID: " + lectureId));

        List<FileLecture> fileLectures = fileLectureRepository.findByLecture(lecture);

        return fileLectures.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Lấy fileLecture theo id
    public FileLectureResponse getFileLectureById(int id) {
        FileLecture fileLecture = fileLectureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy file bài giảng với ID: " + id));

        return convertToResponse(fileLecture);
    }
}
