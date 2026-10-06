package com.campushub.controller;

import com.campushub.dto.AuthDto;
import com.campushub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.JwtAuthResponse> authenticateUser(@Valid @RequestBody AuthDto.LoginRequest loginRequest) {
        AuthDto.JwtAuthResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }
}
