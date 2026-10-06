package com.campushub.repository;

import com.campushub.entity.FeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FeeRecordRepository extends JpaRepository<FeeRecord, Long> {
    List<FeeRecord> findByStudentProfileId(Long studentProfileId);
    List<FeeRecord> findByStatus(FeeRecord.PaymentStatus status);

    @Query("SELECT SUM(f.totalAmount - f.amountPaid) FROM FeeRecord f WHERE f.status != 'PAID'")
    BigDecimal findTotalPendingFees();

    @Query("SELECT SUM(f.amountPaid) FROM FeeRecord f")
    BigDecimal findTotalCollectedFees();
}
