package com.sms.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String role;
    private String message;

    public LoginResponse(String token, String role, String message) {
        this.token = token;
        this.role = role;
        this.message = message;
    }
}