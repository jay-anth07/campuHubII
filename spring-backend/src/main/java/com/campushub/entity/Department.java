package com.campushub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true, length = 20)
    private String code; // e.g. CSE, AIDS, ECE, IT, MECH

    @Column(length = 255)
    private String headOfDepartment;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<StudentProfile> students = new ArrayList<>();

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TimetableEntry> timetableEntries = new ArrayList<>();
}
