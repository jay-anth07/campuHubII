package com.campushub.repository;

import com.campushub.entity.MockTestUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MockTestUploadRepository extends JpaRepository<MockTestUpload, Long> {
    List<MockTestUpload> findByDepartmentId(Long departmentId);
    List<MockTestUpload> findByStatus(MockTestUpload.TestStatus status);
    List<MockTestUpload> findBySemester(Integer semester);
}
