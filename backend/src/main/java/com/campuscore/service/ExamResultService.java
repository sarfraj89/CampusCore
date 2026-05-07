package com.campuscore.service;

import com.campuscore.dto.ExamResultDTO;
import com.campuscore.entity.ExamResult;
import com.campuscore.entity.Student;
import com.campuscore.entity.Subject;
import com.campuscore.mapper.ExamResultMapper;
import com.campuscore.repository.ExamResultRepository;
import com.campuscore.repository.StudentRepository;
import com.campuscore.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamResultService {
    private final ExamResultRepository examResultRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ExamResultMapper examResultMapper;

    public List<ExamResultDTO> getResultsByStudent(UUID studentId) {
        return examResultRepository.findByStudentId(studentId).stream()
                .map(examResultMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ExamResultDTO> getResultsBySubjectAndSemester(UUID subjectId, Integer semester) {
        return examResultRepository.findBySubjectIdAndSemester(subjectId, semester).stream()
                .map(examResultMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExamResultDTO saveResult(ExamResultDTO examResultDTO) {
        ExamResult examResult = examResultMapper.toEntity(examResultDTO);
        
        Student student = studentRepository.findById(examResultDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Subject subject = subjectRepository.findById(examResultDTO.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        examResult.setStudent(student);
        examResult.setSubject(subject);
        
        return examResultMapper.toDTO(examResultRepository.save(examResult));
    }

    @Transactional
    public void deleteResult(UUID id) {
        examResultRepository.deleteById(id);
    }
}
