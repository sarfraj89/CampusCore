package com.campuscore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDTO {
    private UUID id;
    
    @NotBlank(message = "Subject name is required")
    private String name;
    
    @NotBlank(message = "Subject code is required")
    private String code;
    
    @NotNull(message = "Department ID is required")
    private UUID departmentId;
    private String departmentName;
    
    @NotNull(message = "Semester is required")
    private Integer semester;
}
