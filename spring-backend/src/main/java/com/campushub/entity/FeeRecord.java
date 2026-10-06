package com.campushub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @NotBlank
    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear; // e.g. "2024-2025"

    @NotNull
    @Column(nullable = false)
    private Integer semester;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "tuition_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal tuitionFee;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "lab_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal labFee;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "library_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal libraryFee;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "development_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal developmentFee;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status; // PAID, PARTIAL, PENDING

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "transaction_id", length = 64)
    private String transactionId;

    @Column(name = "payment_method", length = 30)
    private String paymentMethod; // UPI, CARD, NETBANKING

    @CreationTimestamp
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public BigDecimal getBalance() {
        return totalAmount.subtract(amountPaid);
    }

    public enum PaymentStatus {
        PAID,
        PARTIAL,
        PENDING
    }
}
