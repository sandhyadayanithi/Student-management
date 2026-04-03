package com.example.facultyservice.security;

public class JwtUser {
    private final String email;
    private final String role;
    private final String facultyId;

    public JwtUser(String email, String role, String facultyId) {
        this.email = email;
        this.role = role;
        this.facultyId = facultyId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getFacultyId() {
        return facultyId;
    }
}
