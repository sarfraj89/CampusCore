package com.campuscore.controller;

import com.campuscore.dto.SubjectDTO;
import com.campuscore.service.SubjectService;
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
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@Tag(name = "Subjects", description = "Management of academic subjects")
public class SubjectController {
    private final SubjectService subjectService;

    @GetMapping
    @Operation(summary = "Get all subjects")
    public List<SubjectDTO> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Get subjects by department")
    public List<SubjectDTO> getSubjectsByDepartment(@PathVariable UUID departmentId) {
        return subjectService.getSubjectsByDepartment(departmentId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new subject")
    public ResponseEntity<SubjectDTO> createSubject(@Valid @RequestBody SubjectDTO subjectDTO) {
        return ResponseEntity.ok(subjectService.createSubject(subjectDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing subject")
    public ResponseEntity<SubjectDTO> updateSubject(@PathVariable UUID id, @Valid @RequestBody SubjectDTO subjectDTO) {
        return ResponseEntity.ok(subjectService.updateSubject(id, subjectDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a subject")
    public ResponseEntity<Void> deleteSubject(@PathVariable UUID id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
