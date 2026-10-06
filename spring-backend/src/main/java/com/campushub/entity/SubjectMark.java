package com.campushub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subject_marks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_profile_id", "subject_code"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @NotBlank
    @Column(name = "subject_name", nullable = false, length = 100)
    private String subjectName; // e.g. "Advanced Data Structures & Algorithms"

    @NotBlank
    @Column(name = "subject_code", nullable = false, length = 20)
    private String subjectCode; // e.g. "CS501"

    @NotNull
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer credits;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "internal_marks", precision = 5, scale = 2)
    private BigDecimal internalMarks;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "external_marks", precision = 5, scale = 2)
    private BigDecimal externalMarks;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "total_marks", precision = 5, scale = 2)
    private BigDecimal totalMarks;

    @Column(length = 5)
    private String grade; // O, A+, A, B+, B, C, F

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
