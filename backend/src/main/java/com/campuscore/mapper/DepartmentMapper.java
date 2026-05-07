package com.campuscore.mapper;

import com.campuscore.dto.DepartmentDTO;
import com.campuscore.entity.Department;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    DepartmentDTO toDTO(Department department);
    Department toEntity(DepartmentDTO departmentDTO);
}
