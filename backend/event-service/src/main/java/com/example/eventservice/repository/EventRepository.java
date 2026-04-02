package com.example.eventservice.repository;

import com.example.eventservice.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    List<Event> findByRollNumber(String rollNumber);

    List<Event> findByFacultyId(String facultyId);

    List<Event> findByFacultyIdAndDateContaining(String facultyId, String month);
}