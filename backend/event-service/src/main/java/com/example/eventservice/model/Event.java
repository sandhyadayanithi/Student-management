package com.example.eventservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    private String id;

    private String studentName;
    private String rollNumber;
    private String eventName;
    private String location;
    private String date;
    private String description;
    private String facultyId;
}