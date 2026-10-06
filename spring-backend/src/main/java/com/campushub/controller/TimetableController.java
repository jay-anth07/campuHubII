package com.campushub.controller;

import com.campushub.entity.TimetableEntry;
import com.campushub.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping
    public ResponseEntity<List<TimetableEntry>> getTimetable(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) String day) {
        List<TimetableEntry> entries = timetableService.getTimetable(department, semester, day);
        return ResponseEntity.ok(entries);
    }
}
