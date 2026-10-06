package com.campushub.repository;

import com.campushub.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByRollNumber(String rollNumber);

    Optional<StudentProfile> findByUserId(Long userId);

    List<StudentProfile> findByDepartmentId(Long departmentId);

    List<StudentProfile> findByDepartmentCode(String departmentCode);

    List<StudentProfile> findByAttendancePercentageLessThan(BigDecimal threshold);

    @Query("SELECT s FROM StudentProfile s JOIN FETCH s.user u JOIN FETCH s.department d")
    List<StudentProfile> findAllWithDetails();

    @Query("SELECT AVG(s.attendancePercentage) FROM StudentProfile s")
    BigDecimal findAverageAttendance();

    @Query("SELECT AVG(s.averageMarks) FROM StudentProfile s")
    BigDecimal findAverageMarks();

    long countByAttendancePercentageLessThan(BigDecimal threshold);
}
