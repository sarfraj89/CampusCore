package com.campuscore.service;

import com.campuscore.dto.AttendanceDTO;
import com.campuscore.entity.Attendance;
import com.campuscore.entity.Faculty;
import com.campuscore.entity.Student;
import com.campuscore.entity.Subject;
import com.campuscore.mapper.AttendanceMapper;
import com.campuscore.repository.AttendanceRepository;
import com.campuscore.repository.FacultyRepository;
import com.campuscore.repository.StudentRepository;
import com.campuscore.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final AttendanceMapper attendanceMapper;

    public List<AttendanceDTO> getAttendanceByDateAndSubject(LocalDate date, UUID subjectId) {
        return attendanceRepository.findByDateAndSubjectId(date, subjectId).stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByStudent(UUID studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(attendanceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<AttendanceDTO> markAttendance(List<AttendanceDTO> attendanceDTOList) {
        return attendanceDTOList.stream().map(dto -> {
            Attendance attendance = attendanceMapper.toEntity(dto);
            
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Subject subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            Faculty faculty = (dto.getFacultyId() != null) ? 
                    facultyRepository.findById(dto.getFacultyId()).orElse(null) : null;
            
            attendance.setStudent(student);
            attendance.setSubject(subject);
            attendance.setFaculty(faculty);
            
            return attendanceMapper.toDTO(attendanceRepository.save(attendance));
        }).collect(Collectors.toList());
    }
}
