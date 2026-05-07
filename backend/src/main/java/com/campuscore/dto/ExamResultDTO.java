package com.campuscore.dto;

import com.campuscore.enums.Grade;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultDTO {
    private UUID id;
    
    @NotNull(message = "Student ID is required")
    private UUID studentId;
    private String studentName;
    private String rollNumber;
    
    @NotNull(message = "Subject ID is required")
    private UUID subjectId;
    private String subjectName;
    
    @NotNull(message = "Exam type is required")
    private String examType;
    
    @NotNull(message = "Marks obtained is required")
    private BigDecimal marksObtained;
    
    @NotNull(message = "Total marks is required")
    private BigDecimal totalMarks;
    
    @NotNull(message = "Grade is required")
    private Grade grade;
    
    @NotNull(message = "Semester is required")
    private Integer semester;
    
    @NotNull(message = "Academic year is required")
    private String academicYear;
}
