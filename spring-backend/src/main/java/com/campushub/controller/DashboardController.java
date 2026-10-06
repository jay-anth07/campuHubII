package com.campushub.controller;

import com.campushub.dto.DashboardDto;
import com.campushub.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'STUDENT')")
    public ResponseEntity<DashboardDto.StatsResponse> getDashboardStats() {
        DashboardDto.StatsResponse stats = dashboardService.getAggregatedStats();
        return ResponseEntity.ok(stats);
    }
}
