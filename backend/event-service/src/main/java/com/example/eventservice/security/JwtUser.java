package com.example.eventservice.security;

public class JwtUser {
    private final String email;
    private final String role;
    private final String rollNumber;
    private final String facultyId;

    public JwtUser(String email, String role, String rollNumber, String facultyId) {
        this.email = email;
        this.role = role;
        this.rollNumber = rollNumber;
        this.facultyId = facultyId;
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

    public String getFacultyId() {
        return facultyId;
    }
}
