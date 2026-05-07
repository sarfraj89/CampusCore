package com.campuscore.controller;

import com.campuscore.dto.AttendanceDTO;
import com.campuscore.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Management of student attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    @GetMapping("/filter")
    @Operation(summary = "Get attendance by date and subject")
    public List<AttendanceDTO> getAttendanceByDateAndSubject(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam UUID subjectId) {
        return attendanceService.getAttendanceByDateAndSubject(date, subjectId);
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get attendance records for a student")
    public List<AttendanceDTO> getAttendanceByStudent(@PathVariable UUID studentId) {
        return attendanceService.getAttendanceByStudent(studentId);
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('FACULTY') or hasRole('ADMIN')")
    @Operation(summary = "Mark attendance in bulk")
    public ResponseEntity<List<AttendanceDTO>> markAttendance(@Valid @RequestBody List<AttendanceDTO> attendanceDTOList) {
        return ResponseEntity.ok(attendanceService.markAttendance(attendanceDTOList));
    }
}
