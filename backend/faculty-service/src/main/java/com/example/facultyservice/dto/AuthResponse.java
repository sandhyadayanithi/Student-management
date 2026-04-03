package com.example.facultyservice.dto;

import com.example.facultyservice.model.Faculty;

public class AuthResponse {
    private String token;
    private String role;
    private Faculty user;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role, Faculty user) {
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

    public Faculty getUser() {
        return user;
    }

    public void setUser(Faculty user) {
        this.user = user;
    }
}
