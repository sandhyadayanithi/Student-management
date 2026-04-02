package com.example.facultyservice.repository;

import com.example.facultyservice.model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FacultyRepository extends MongoRepository<Faculty, String> {

    Optional<Faculty> findByEmail(String email);
}