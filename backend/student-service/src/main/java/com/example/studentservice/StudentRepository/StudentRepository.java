package com.example.studentservice.StudentRepository;

import com.example.studentservice.StudentModel.StudentModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StudentRepository extends MongoRepository<StudentModel, String> {

    Optional<StudentModel> findByEmail(String email);
}