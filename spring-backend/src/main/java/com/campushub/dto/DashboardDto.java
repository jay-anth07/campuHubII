package com.campushub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatsResponse {
        private Long totalStudents;
        private BigDecimal avgAttendance;
        private BigDecimal avgMarks;
        private Long defaultersCount;
        private BigDecimal pendingFeesTotal;
        private BigDecimal collectedFeesTotal;
        private List<DepartmentBreakdown> departmentBreakdown;
        private List<AttendanceBand> attendanceDistribution;
        private List<StudentDto.StudentSummary> topPerformers;
        private List<StudentDto.StudentSummary> defaultersList;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentBreakdown {
        private String departmentCode;
        private String departmentName;
        private Long studentCount;
        private BigDecimal avgAttendance;
        private BigDecimal avgMarks;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttendanceBand {
        private String range; // "<65%", "65-74%", "75-84%", "85-100%"
        private Long count;
        private Double percentage;
    }
}
