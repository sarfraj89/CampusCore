package com.campuscore.service;

import com.campuscore.dto.SubjectDTO;
import com.campuscore.entity.Department;
import com.campuscore.entity.Subject;
import com.campuscore.mapper.SubjectMapper;
import com.campuscore.repository.DepartmentRepository;
import com.campuscore.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectMapper subjectMapper;

    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(subjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<SubjectDTO> getSubjectsByDepartment(UUID departmentId) {
        return subjectRepository.findByDepartmentId(departmentId).stream()
                .map(subjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubjectDTO createSubject(SubjectDTO subjectDTO) {
        Subject subject = subjectMapper.toEntity(subjectDTO);
        Department dept = departmentRepository.findById(subjectDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        subject.setDepartment(dept);
        return subjectMapper.toDTO(subjectRepository.save(subject));
    }

    @Transactional
    public SubjectDTO updateSubject(UUID id, SubjectDTO subjectDTO) {
        Subject existing = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        existing.setName(subjectDTO.getName());
        existing.setCode(subjectDTO.getCode());
        existing.setSemester(subjectDTO.getSemester());
        
        if (!existing.getDepartment().getId().equals(subjectDTO.getDepartmentId())) {
            Department dept = departmentRepository.findById(subjectDTO.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            existing.setDepartment(dept);
        }
        
        return subjectMapper.toDTO(subjectRepository.save(existing));
    }

    @Transactional
    public void deleteSubject(UUID id) {
        subjectRepository.deleteById(id);
    }
}
