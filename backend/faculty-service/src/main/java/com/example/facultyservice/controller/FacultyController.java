package com.example.facultyservice.controller;

import com.example.facultyservice.model.Faculty;
import com.example.facultyservice.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/faculty")
@CrossOrigin("*")
public class FacultyController {

    @Autowired
    private FacultyService service;

    @PostMapping("/register")
    public Faculty register(@RequestBody Faculty faculty) {
        return service.register(faculty);
    }

    @PostMapping("/login")
    public Optional<Faculty> login(@RequestBody Faculty faculty) {
        return service.login(faculty.getEmail(), faculty.getPassword());
    }
}