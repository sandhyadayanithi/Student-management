package com.example.studentservice.StudentService;

import com.example.studentservice.StudentModel.StudentModel;
import com.example.studentservice.StudentRepository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public StudentModel register(StudentModel student) {
        if (student.getPassword() != null && !student.getPassword().isBlank()) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
        return repo.save(student);
    }

    public Optional<StudentModel> login(String email, String password) {
        Optional<StudentModel> student = repo.findByEmail(email);

        if (student.isPresent() && student.get().getPassword() != null) {
            String stored = student.get().getPassword();
            if (passwordEncoder.matches(password, stored)) {
                return student;
            }
            if (stored.equals(password)) {
                student.get().setPassword(passwordEncoder.encode(password));
                repo.save(student.get());
                return student;
            }
        }
        return Optional.empty();
    }

    public List<StudentModel> getAllStudents() {
        return repo.findAll();
    }
}
