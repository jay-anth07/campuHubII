package com.campushub.repository;

import com.campushub.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {
    List<TimetableEntry> findByDepartmentIdAndSemesterAndSection(Long departmentId, Integer semester, String section);
    List<TimetableEntry> findByDayOfWeek(TimetableEntry.DayOfWeek dayOfWeek);
    List<TimetableEntry> findByDepartmentCodeAndSemester(String departmentCode, Integer semester);
}
