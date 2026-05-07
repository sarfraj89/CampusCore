package com.campuscore.service;

import com.campuscore.dto.FacultyDTO;
import com.campuscore.entity.Department;
import com.campuscore.entity.Faculty;
import com.campuscore.entity.User;
import com.campuscore.enums.Role;
import com.campuscore.mapper.FacultyMapper;
import com.campuscore.repository.DepartmentRepository;
import com.campuscore.repository.FacultyRepository;
import com.campuscore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyService {
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final FacultyMapper facultyMapper;
    private final PasswordEncoder passwordEncoder;

    public List<FacultyDTO> getAllFaculty() {
        return facultyRepository.findAll().stream()
                .map(facultyMapper::toDTO)
                .collect(Collectors.toList());
    }

    public FacultyDTO getFacultyById(UUID id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        return facultyMapper.toDTO(faculty);
    }

    @Transactional
    public FacultyDTO createFaculty(FacultyDTO facultyDTO) {
        User user = User.builder()
                .fullName(facultyDTO.getFullName())
                .email(facultyDTO.getEmail())
                .password(passwordEncoder.encode("Welcome@123"))
                .role(Role.FACULTY)
                .enabled(true)
                .firstLogin(true)
                .build();
        user = userRepository.save(user);

        Faculty faculty = facultyMapper.toEntity(facultyDTO);
        faculty.setUser(user);
        
        Department dept = departmentRepository.findById(facultyDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        faculty.setDepartment(dept);

        return facultyMapper.toDTO(facultyRepository.save(faculty));
    }

    @Transactional
    public FacultyDTO updateFaculty(UUID id, FacultyDTO facultyDTO) {
        Faculty existing = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        User user = existing.getUser();
        user.setFullName(facultyDTO.getFullName());
        user.setEmail(facultyDTO.getEmail());
        userRepository.save(user);

        existing.setDesignation(facultyDTO.getDesignation());
        
        if (facultyDTO.getDepartmentId() != null && !facultyDTO.getDepartmentId().equals(existing.getDepartment().getId())) {
            Department dept = departmentRepository.findById(facultyDTO.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            existing.setDepartment(dept);
        }
        
        return facultyMapper.toDTO(facultyRepository.save(existing));
    }

    @Transactional
    public void deleteFaculty(UUID id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        UUID userId = faculty.getUser().getId();
        facultyRepository.delete(faculty);
        userRepository.deleteById(userId);
    }
}
