package com.example.facultyservice.controller;

import com.example.facultyservice.dto.AuthResponse;
import com.example.facultyservice.model.Faculty;
import com.example.facultyservice.security.JwtUtil;
import com.example.facultyservice.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/faculty")
@CrossOrigin("*")
public class FacultyController {

    @Autowired
    private FacultyService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Faculty register(@RequestBody Faculty faculty) {
        Faculty saved = service.register(faculty);
        saved.setPassword(null);
        return saved;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody Faculty faculty) {
        Optional<Faculty> result = service.login(faculty.getEmail(), faculty.getPassword());
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Faculty user = result.get();
        user.setPassword(null);
        String token = jwtUtil.generateFacultyToken(user.getEmail(), user.getFacultyId());
        return ResponseEntity.ok(new AuthResponse(token, "faculty", user));
    }
}
