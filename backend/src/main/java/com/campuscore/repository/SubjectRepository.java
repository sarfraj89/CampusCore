package com.campuscore.repository;

import com.campuscore.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {
    Optional<Subject> findByCode(String code);
    List<Subject> findByDepartmentIdAndSemester(UUID departmentId, Integer semester);
}
