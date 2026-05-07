package com.campuscore.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    private UUID id;
    
    @NotBlank(message = "Department name is required")
    private String name;
    
    @NotBlank(message = "Department code is required")
    private String code;
}
