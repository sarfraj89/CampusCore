package com.campuscore.controller;

import com.campuscore.dto.FacultyDTO;
import com.campuscore.service.FacultyService;
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
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
@Tag(name = "Faculty", description = "Management of university faculty members")
public class FacultyController {
    private final FacultyService facultyService;

    @GetMapping
    @Operation(summary = "Get all faculty")
    public List<FacultyDTO> getAllFaculty() {
        return facultyService.getAllFaculty();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get faculty by ID")
    public ResponseEntity<FacultyDTO> getFacultyById(@PathVariable UUID id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new faculty member")
    public ResponseEntity<FacultyDTO> createFaculty(@Valid @RequestBody FacultyDTO facultyDTO) {
        return ResponseEntity.ok(facultyService.createFaculty(facultyDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing faculty member")
    public ResponseEntity<FacultyDTO> updateFaculty(@PathVariable UUID id, @Valid @RequestBody FacultyDTO facultyDTO) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, facultyDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a faculty member")
    public ResponseEntity<Void> deleteFaculty(@PathVariable UUID id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }
}
