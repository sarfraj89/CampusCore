package com.campuscore.mapper;

import com.campuscore.dto.AttendanceDTO;
import com.campuscore.entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    @Mapping(source = "student.rollNumber", target = "rollNumber")
    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.name", target = "subjectName")
    @Mapping(source = "faculty.id", target = "facultyId")
    @Mapping(source = "faculty.user.fullName", target = "facultyName")
    AttendanceDTO toDTO(Attendance attendance);

    @Mapping(source = "studentId", target = "student.id")
    @Mapping(source = "subjectId", target = "subject.id")
    @Mapping(source = "facultyId", target = "faculty.id")
    Attendance toEntity(AttendanceDTO attendanceDTO);
}
