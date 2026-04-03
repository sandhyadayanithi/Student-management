package com.example.studentservice.StudentController;

import com.example.studentservice.StudentModel.StudentModel;
import com.example.studentservice.StudentService.StudentService;
import com.example.studentservice.dto.AuthResponse;
import com.example.studentservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public StudentModel register(@RequestBody StudentModel student) {
        StudentModel saved = service.register(student);
        saved.setPassword(null);
        return saved;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody StudentModel student) {
        Optional<StudentModel> result = service.login(student.getEmail(), student.getPassword());
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        StudentModel user = result.get();
        user.setPassword(null);
        String token = jwtUtil.generateStudentToken(user.getEmail(), user.getRollNumber());
        return ResponseEntity.ok(new AuthResponse(token, "student", user));
    }

    @GetMapping
    public List<StudentModel> getAllStudents() {
        List<StudentModel> students = service.getAllStudents();
        for (StudentModel student : students) {
            student.setPassword(null);
        }
        return students;
    }
}
