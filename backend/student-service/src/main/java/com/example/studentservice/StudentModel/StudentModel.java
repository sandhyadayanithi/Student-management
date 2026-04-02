package com.example.studentservice.StudentModel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentModel {

    @Id
    private String id;

    private String rollNumber;
    private String name;
    private String email;
    private String password;
}