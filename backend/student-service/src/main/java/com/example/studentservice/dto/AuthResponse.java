package com.example.studentservice.dto;

import com.example.studentservice.StudentModel.StudentModel;

public class AuthResponse {
    private String token;
    private String role;
    private StudentModel user;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role, StudentModel user) {
        this.token = token;
        this.role = role;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public StudentModel getUser() {
        return user;
    }

    public void setUser(StudentModel user) {
        this.user = user;
    }
}
