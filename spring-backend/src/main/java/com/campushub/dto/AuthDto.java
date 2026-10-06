package com.campushub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Username or email is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        private String role; // "FACULTY" or "STUDENT"
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JwtAuthResponse {
        private String token;
        @Builder.Default
        private String tokenType = "Bearer";
        private Long userId;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private String avatarUrl;
        private Long studentProfileId;
        private String rollNumber;
        private String departmentCode;
    }
}
