package com.campuscore.controller;

import com.campuscore.dto.ExamResultDTO;
import com.campuscore.service.ExamResultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exam-results")
@RequiredArgsConstructor
@Tag(name = "Exam Results", description = "Management of student examination results")
public class ExamResultController {
    private final ExamResultService examResultService;

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get exam results for a student")
    public List<ExamResultDTO> getResultsByStudent(@PathVariable UUID studentId) {
        return examResultService.getResultsByStudent(studentId);
    }

    @GetMapping("/filter")
    @Operation(summary = "Get exam results by subject and semester")
    public List<ExamResultDTO> getResultsBySubjectAndSemester(
            @RequestParam UUID subjectId, 
            @RequestParam Integer semester) {
        return examResultService.getResultsBySubjectAndSemester(subjectId, semester);
    }

    @PostMapping
    @PreAuthorize("hasRole('FACULTY') or hasRole('ADMIN')")
    @Operation(summary = "Save or update an exam result")
    public ResponseEntity<ExamResultDTO> saveResult(@Valid @RequestBody ExamResultDTO examResultDTO) {
        return ResponseEntity.ok(examResultService.saveResult(examResultDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an exam result")
    public ResponseEntity<Void> deleteResult(@PathVariable UUID id) {
        examResultService.deleteResult(id);
        return ResponseEntity.noContent().build();
    }
}
