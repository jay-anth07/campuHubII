package com.campushub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mock_test_uploads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockTestUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "test_title", nullable = false, length = 150)
    private String testTitle;

    @NotBlank
    @Column(name = "subject_code", nullable = false, length = 20)
    private String subjectCode;

    @NotBlank
    @Column(name = "subject_name", nullable = false, length = 100)
    private String subjectName;

    @NotNull
    @Column(nullable = false)
    private Integer semester;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @NotBlank
    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_size_kb")
    private Long fileSizeKb;

    @Column(name = "file_type", length = 50)
    private String fileType; // application/pdf, etc.

    @Column(name = "download_url", length = 500)
    private String downloadUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TestStatus status; // ACTIVE, SCHEDULED, COMPLETED, DRAFT

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    public enum TestStatus {
        ACTIVE,
        SCHEDULED,
        COMPLETED,
        DRAFT
    }
}
