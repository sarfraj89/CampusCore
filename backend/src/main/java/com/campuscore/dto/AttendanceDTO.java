package com.campuscore.dto;

import com.campuscore.enums.AttendanceStatus;
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
public class AttendanceDTO {
    private UUID id;
    
    @NotNull(message = "Student ID is required")
    private UUID studentId;
    private String studentName;
    private String rollNumber;
    
    @NotNull(message = "Subject ID is required")
    private UUID subjectId;
    private String subjectName;
    
    private UUID facultyId;
    private String facultyName;
    
    @NotNull(message = "Status is required")
    private AttendanceStatus status;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Lecture slot is required")
    private String lectureSlot;
}
