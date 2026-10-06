package com.campushub.controller;

import com.campushub.dto.StudentDto;
import com.campushub.service.MarksService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class MarksController {

    private final MarksService marksService;

    @PutMapping("/{studentId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<StudentDto.SubjectMarkDto>> updateStudentMarks(
            @PathVariable Long studentId,
            @Valid @RequestBody StudentDto.MarksBatchUpdateRequest marksRequest) {
        List<StudentDto.SubjectMarkDto> updatedMarks = marksService.updateMarks(studentId, marksRequest.getMarks());
        return ResponseEntity.ok(updatedMarks);
    }
}
