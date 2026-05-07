package com.campuscore.repository;

import com.campuscore.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByUserId(UUID userId);
    java.util.List<Student> findByDepartmentIdAndSemester(UUID departmentId, Integer semester);
}
