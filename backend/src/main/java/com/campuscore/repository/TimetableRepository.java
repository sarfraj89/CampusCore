package com.campuscore.repository;

import com.campuscore.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, UUID> {
    List<Timetable> findByFacultyId(UUID facultyId);
    List<Timetable> findBySemesterAndDivision(Integer semester, String division);
}
