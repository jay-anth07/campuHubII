package com.campushub.controller;

import com.campushub.dto.FeeDto;
import com.campushub.entity.FeeRecord;
import com.campushub.service.FeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeeController {

    private final FeeService feeService;

    @PostMapping("/pay")
    public ResponseEntity<FeeDto.PaymentResponse> processPayment(@Valid @RequestBody FeeDto.PaymentRequest paymentRequest) {
        FeeDto.PaymentResponse response = feeService.processPayment(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentProfileId}")
    public ResponseEntity<List<FeeRecord>> getStudentFeeRecords(@PathVariable Long studentProfileId) {
        List<FeeRecord> records = feeService.getStudentFeeRecords(studentProfileId);
        return ResponseEntity.ok(records);
    }
}
