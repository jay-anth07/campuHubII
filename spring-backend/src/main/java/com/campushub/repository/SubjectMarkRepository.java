package com.campushub.repository;

import com.campushub.entity.SubjectMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectMarkRepository extends JpaRepository<SubjectMark, Long> {
    List<SubjectMark> findByStudentProfileId(Long studentProfileId);
    Optional<SubjectMark> findByStudentProfileIdAndSubjectCode(Long studentProfileId, String subjectCode);
}
