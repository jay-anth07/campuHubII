package com.campushub.controller;

import com.campushub.dto.StudentDto;
import com.campushub.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<StudentDto.StudentDetailResponse>> getAllStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean defaulterOnly) {
        List<StudentDto.StudentDetailResponse> students = studentService.getStudents(department, search, defaulterOnly);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'STUDENT')")
    public ResponseEntity<StudentDto.StudentDetailResponse> getStudentById(@PathVariable Long id) {
        StudentDto.StudentDetailResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<StudentDto.StudentDetailResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDto.StudentUpdateRequest updateRequest) {
        StudentDto.StudentDetailResponse updated = studentService.updateStudent(id, updateRequest);
        return ResponseEntity.ok(updated);
    }
}
