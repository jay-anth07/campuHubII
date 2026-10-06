package com.campushub.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FeeDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentRequest {
        @NotNull(message = "Fee record ID is required")
        private Long feeRecordId;

        @NotNull(message = "Payment amount is required")
        @DecimalMin(value = "1.00", message = "Amount must be at least 1.00")
        private BigDecimal amount;

        @NotBlank(message = "Payment method is required")
        private String paymentMethod; // "UPI", "CARD", "NETBANKING"

        private String upiVpa;
        private String cardLast4;
        private String bankName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentResponse {
        private boolean success;
        private String transactionId;
        private String receiptNumber;
        private BigDecimal amountPaid;
        private BigDecimal remainingBalance;
        private String newStatus;
        private LocalDateTime timestamp;
        private String message;
    }
}
