package com.example.facultyservice.service;

import com.example.facultyservice.model.Faculty;
import com.example.facultyservice.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository repo;

    public Faculty register(Faculty faculty) {
        return repo.save(faculty);
    }

    public Optional<Faculty> login(String email, String password) {
        Optional<Faculty> faculty = repo.findByEmail(email);

        if (faculty.isPresent() && faculty.get().getPassword().equals(password)) {
            return faculty;
        }
        return Optional.empty();
    }
}