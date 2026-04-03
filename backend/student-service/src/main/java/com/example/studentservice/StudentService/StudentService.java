package com.example.studentservice.StudentService;

import com.example.studentservice.StudentModel.StudentModel;
import com.example.studentservice.StudentRepository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repo;

    public StudentModel register(StudentModel student) {
        return repo.save(student);
    }

    public Optional<StudentModel> login(String email, String password) {
        Optional<StudentModel> student = repo.findByEmail(email);

        if (student.isPresent() && student.get().getPassword().equals(password)) {
            return student;
        }
        return Optional.empty();
    }

    public List<StudentModel> getAllStudents() {
        return repo.findAll();
    }
}
