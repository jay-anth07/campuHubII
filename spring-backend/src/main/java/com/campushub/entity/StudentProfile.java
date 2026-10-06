package com.campushub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles", uniqueConstraints = {
    @UniqueConstraint(columnNames = "roll_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotBlank
    @Column(name = "roll_number", nullable = false, unique = true, length = 30)
    private String rollNumber; // e.g. 21CS042, 22AI018

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @NotNull
    @Min(1)
    @Max(8)
    @Column(nullable = false)
    private Integer semester;

    @NotBlank
    @Column(nullable = false, length = 5)
    private String section; // 'A', 'B', 'C'

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "attendance_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal attendancePercentage;

    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "average_marks", precision = 5, scale = 2)
    private BigDecimal averageMarks;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 255)
    private String guardianName;

    @Column(length = 20)
    private String guardianPhone;

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SubjectMark> subjectMarks = new ArrayList<>();

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<FeeRecord> feeRecords = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public boolean isAttendanceDefaulter() {
        return attendancePercentage != null && attendancePercentage.compareTo(new BigDecimal("75.00")) < 0;
    }
}
