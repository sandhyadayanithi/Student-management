package com.example.facultyservice.service;

import com.example.facultyservice.model.Faculty;
import com.example.facultyservice.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Faculty register(Faculty faculty) {
        if (faculty.getPassword() != null && !faculty.getPassword().isBlank()) {
            faculty.setPassword(passwordEncoder.encode(faculty.getPassword()));
        }
        return repo.save(faculty);
    }

    public Optional<Faculty> login(String email, String password) {
        Optional<Faculty> faculty = repo.findByEmail(email);

        if (faculty.isPresent() && faculty.get().getPassword() != null) {
            String stored = faculty.get().getPassword();
            if (passwordEncoder.matches(password, stored)) {
                return faculty;
            }
            if (stored.equals(password)) {
                faculty.get().setPassword(passwordEncoder.encode(password));
                repo.save(faculty.get());
                return faculty;
            }
        }
        return Optional.empty();
    }
}
