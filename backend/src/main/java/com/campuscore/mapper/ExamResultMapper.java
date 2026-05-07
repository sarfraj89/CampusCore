package com.campuscore.mapper;

import com.campuscore.dto.ExamResultDTO;
import com.campuscore.entity.ExamResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamResultMapper {
    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    @Mapping(source = "student.rollNumber", target = "rollNumber")
    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.name", target = "subjectName")
    ExamResultDTO toDTO(ExamResult examResult);

    @Mapping(source = "studentId", target = "student.id")
    @Mapping(source = "subjectId", target = "subject.id")
    ExamResult toEntity(ExamResultDTO examResultDTO);
}
