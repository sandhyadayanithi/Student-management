package com.example.studentservice.security;

public class JwtUser {
    private final String email;
    private final String role;
    private final String rollNumber;

    public JwtUser(String email, String role, String rollNumber) {
        this.email = email;
        this.role = role;
        this.rollNumber = rollNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getRollNumber() {
        return rollNumber;
    }
}
