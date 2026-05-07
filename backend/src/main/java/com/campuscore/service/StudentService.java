package com.campuscore.service;

import com.campuscore.dto.StudentDTO;
import com.campuscore.entity.Department;
import com.campuscore.entity.Student;
import com.campuscore.entity.User;
import com.campuscore.enums.Role;
import com.campuscore.mapper.StudentMapper;
import com.campuscore.repository.DepartmentRepository;
import com.campuscore.repository.StudentRepository;
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
public class StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentMapper studentMapper;
    private final PasswordEncoder passwordEncoder;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return studentMapper.toDTO(student);
    }

    public List<StudentDTO> getStudentsByDepartmentAndSemester(UUID departmentId, Integer semester) {
        return studentRepository.findByDepartmentIdAndSemester(departmentId, semester).stream()
                .map(studentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        User user = User.builder()
                .fullName(studentDTO.getFullName())
                .email(studentDTO.getEmail())
                .password(passwordEncoder.encode("Welcome@123"))
                .role(Role.STUDENT)
                .enabled(true)
                .firstLogin(true)
                .build();
        user = userRepository.save(user);

        Student student = studentMapper.toEntity(studentDTO);
        student.setUser(user);
        
        Department dept = departmentRepository.findById(studentDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        student.setDepartment(dept);

        return studentMapper.toDTO(studentRepository.save(student));
    }

    @Transactional
    public StudentDTO updateStudent(UUID id, StudentDTO studentDTO) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        User user = existing.getUser();
        user.setFullName(studentDTO.getFullName());
        user.setEmail(studentDTO.getEmail());
        userRepository.save(user);

        existing.setRollNumber(studentDTO.getRollNumber());
        existing.setCourse(studentDTO.getCourse());
        existing.setSemester(studentDTO.getSemester());
        existing.setAcademicYear(studentDTO.getAcademicYear());
        existing.setDivision(studentDTO.getDivision());
        existing.setGuardianName(studentDTO.getGuardianName());
        existing.setGuardianPhone(studentDTO.getGuardianPhone());
        existing.setDateOfBirth(studentDTO.getDateOfBirth());
        existing.setAddress(studentDTO.getAddress());
        
        if (studentDTO.getDepartmentId() != null && !studentDTO.getDepartmentId().equals(existing.getDepartment().getId())) {
            Department dept = departmentRepository.findById(studentDTO.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            existing.setDepartment(dept);
        }
        
        return studentMapper.toDTO(studentRepository.save(existing));
    }

    @Transactional
    public void deleteStudent(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        UUID userId = student.getUser().getId();
        studentRepository.delete(student);
        userRepository.deleteById(userId);
    }
}
