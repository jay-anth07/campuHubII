package com.campushub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "timetable_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @NotNull
    @Column(nullable = false)
    private Integer semester;

    @NotBlank
    @Column(nullable = false, length = 5)
    private String section;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 10)
    private DayOfWeek dayOfWeek; // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY

    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @NotBlank
    @Column(name = "course_code", nullable = false, length = 20)
    private String courseCode;

    @NotBlank
    @Column(name = "course_name", nullable = false, length = 100)
    private String courseName;

    @NotBlank
    @Column(name = "instructor_name", nullable = false, length = 100)
    private String instructorName;

    @NotBlank
    @Column(name = "room_number", nullable = false, length = 50)
    private String roomNumber;

    @Column(name = "is_lab")
    private boolean isLab = false;

    public enum DayOfWeek {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY
    }
}
