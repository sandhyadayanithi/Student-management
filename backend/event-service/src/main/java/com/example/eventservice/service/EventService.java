package com.example.eventservice.service;

import com.example.eventservice.model.Event;
import com.example.eventservice.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository repo;

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    // ADD EVENT
    public Event addEvent(Event event) {
        return repo.save(event);
    }

    // STUDENT VIEW
    public List<Event> getByRollNumber(String rollNumber) {
        return repo.findByRollNumber(rollNumber);
    }

    // FACULTY VIEW BY MONTH
    public List<Event> getByMonth(String facultyId, String month) {
        return repo.findByFacultyIdAndDateContaining(facultyId, month);
    }

    // UPDATE (ONLY SAME FACULTY)
    public Event updateEvent(String id, Event updated, String facultyId) {
        Event event = repo.findById(id).orElseThrow();

        if (!event.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized");
        }

        event.setEventName(updated.getEventName());
        event.setLocation(updated.getLocation());
        event.setDate(updated.getDate());
        event.setDescription(updated.getDescription());

        return repo.save(event);
    }

    // UPDATE (STUDENT-OWNED EXTERNAL EVENT)
    public Event updateEventForStudent(String id, Event updated, String rollNumber) {
        Event event = repo.findById(id).orElseThrow();

        if (!isBlank(event.getFacultyId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (!event.getRollNumber().equals(rollNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        event.setEventName(updated.getEventName());
        event.setLocation(updated.getLocation());
        event.setDate(updated.getDate());
        event.setDescription(updated.getDescription());

        return repo.save(event);
    }

    // DELETE (ONLY SAME FACULTY)
    public String deleteEvent(String id, String facultyId) {
        Event event = repo.findById(id).orElseThrow();

        if (!event.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized");
        }

        repo.deleteById(id);
        return "Deleted successfully";
    }

    // DELETE (STUDENT-OWNED EXTERNAL EVENT)
    public String deleteEventForStudent(String id, String rollNumber) {
        Event event = repo.findById(id).orElseThrow();

        if (!isBlank(event.getFacultyId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (!event.getRollNumber().equals(rollNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        repo.deleteById(id);
        return "Deleted successfully";
    }
}
