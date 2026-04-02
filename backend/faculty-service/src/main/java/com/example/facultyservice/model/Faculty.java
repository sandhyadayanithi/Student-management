package com.example.facultyservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "faculty")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Faculty {

    @Id
    private String id;

    private String facultyId;
    private String facultyName;
    private String email;
    private String password;
}