package com.campushub.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class StudentDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentDetailResponse {
        private Long id;
        private Long userId;
        private String rollNumber;
        private String fullName;
        private String email;
        private String phone;
        private String departmentCode;
        private String departmentName;
        private Integer semester;
        private String section;
        private BigDecimal attendancePercentage;
        private BigDecimal averageMarks;
        private boolean isDefaulter;
        private String guardianName;
        private String guardianPhone;
        private List<SubjectMarkDto> subjects;
        private FeeSummary feeSummary;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentSummary {
        private Long id;
        private String rollNumber;
        private String fullName;
        private String departmentCode;
        private Integer semester;
        private String section;
        private BigDecimal attendancePercentage;
        private BigDecimal averageMarks;
        private boolean isDefaulter;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentUpdateRequest {
        @DecimalMin("0.00")
        @DecimalMax("100.00")
        private BigDecimal attendancePercentage;

        private Integer semester;
        private String section;
        private String phone;
        private String guardianName;
        private String guardianPhone;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubjectMarkDto {
        private Long id;
        private String subjectCode;
        private String subjectName;
        private Integer credits;
        private BigDecimal internalMarks;
        private BigDecimal externalMarks;
        private BigDecimal totalMarks;
        private String grade;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MarksBatchUpdateRequest {
        @NotEmpty
        private List<SubjectMarkDto> marks;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeeSummary {
        private BigDecimal totalDue;
        private BigDecimal amountPaid;
        private BigDecimal balance;
        private String status;
    }
}
