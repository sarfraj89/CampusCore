package com.campuscore.service;

import com.campuscore.dto.DepartmentDTO;
import com.campuscore.entity.Department;
import com.campuscore.mapper.DepartmentMapper;
import com.campuscore.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return departmentMapper.toDTO(department);
    }

    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        Department department = departmentMapper.toEntity(departmentDTO);
        return departmentMapper.toDTO(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentDTO updateDepartment(UUID id, DepartmentDTO departmentDTO) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        existing.setName(departmentDTO.getName());
        existing.setCode(departmentDTO.getCode());
        return departmentMapper.toDTO(departmentRepository.save(existing));
    }

    @Transactional
    public void deleteDepartment(UUID id) {
        departmentRepository.deleteById(id);
    }
}
