package com.campuscore.mapper;

import com.campuscore.dto.SubjectDTO;
import com.campuscore.entity.Subject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubjectMapper {
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    SubjectDTO toDTO(Subject subject);

    @Mapping(source = "departmentId", target = "department.id")
    Subject toEntity(SubjectDTO subjectDTO);
}
