package com.campuscore.repository;

import com.campuscore.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, UUID> {
    List<ExamResult> findByStudentId(UUID studentId);
    List<ExamResult> findBySemesterAndSubjectIdAndAcademicYear(Integer semester, UUID subjectId, String academicYear);
}
