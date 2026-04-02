package com.example.studentservice.StudentController;

import com.example.studentservice.StudentModel.StudentModel;
import com.example.studentservice.StudentService.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService service;

    @PostMapping("/register")
    public StudentModel register(@RequestBody StudentModel student) {
        return service.register(student);
    }

    @PostMapping("/login")
    public Optional<StudentModel> login(@RequestBody StudentModel student) {
        return service.login(student.getEmail(), student.getPassword());
    }
}