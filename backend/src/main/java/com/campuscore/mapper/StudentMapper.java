package com.campuscore.mapper;

import com.campuscore.dto.StudentDTO;
import com.campuscore.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    @Mapping(source = "user.fullName", target = "fullName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    StudentDTO toDTO(Student student);

    @Mapping(source = "fullName", target = "user.fullName")
    @Mapping(source = "email", target = "user.email")
    @Mapping(source = "departmentId", target = "department.id")
    Student toEntity(StudentDTO studentDTO);
}
