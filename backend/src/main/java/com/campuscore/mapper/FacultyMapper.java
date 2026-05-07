package com.campuscore.mapper;

import com.campuscore.dto.FacultyDTO;
import com.campuscore.entity.Faculty;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FacultyMapper {
    @Mapping(source = "user.fullName", target = "fullName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    FacultyDTO toDTO(Faculty faculty);

    @Mapping(source = "fullName", target = "user.fullName")
    @Mapping(source = "email", target = "user.email")
    @Mapping(source = "departmentId", target = "department.id")
    Faculty toEntity(FacultyDTO facultyDTO);
}
