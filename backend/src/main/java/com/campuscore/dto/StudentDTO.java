package com.campuscore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private UUID id;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Roll number is required")
    private String rollNumber;
    
    @NotBlank(message = "Course is required")
    private String course;
    
    @NotNull(message = "Semester is required")
    private Integer semester;
    
    @NotBlank(message = "Academic year is required")
    private String academicYear;
    
    @NotBlank(message = "Division is required")
    private String division;
    
    private String guardianName;
    private String guardianPhone;
    private LocalDate dateOfBirth;
    private String address;
    
    @NotNull(message = "Department ID is required")
    private UUID departmentId;
    private String departmentName;
}
