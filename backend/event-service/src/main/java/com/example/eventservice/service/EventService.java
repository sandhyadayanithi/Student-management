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
        String monthToken = normalizeMonthToken(month);
        if (monthToken == null) {
            return repo.findByFacultyIdAndDateContaining(facultyId, month);
        }
        return repo.findByFacultyIdAndDateContaining(facultyId, monthToken);
    }

    private String normalizeMonthToken(String month) {
        if (month == null || month.isBlank()) {
            return null;
        }
        String trimmed = month.trim();
        if (trimmed.matches("\\d{1,2}")) {
            int monthNum = Integer.parseInt(trimmed);
            if (monthNum >= 1 && monthNum <= 12) {
                return String.format("-%02d-", monthNum);
            }
        }
        String lower = trimmed.toLowerCase();
        switch (lower) {
            case "january": return "-01-";
            case "february": return "-02-";
            case "march": return "-03-";
            case "april": return "-04-";
            case "may": return "-05-";
            case "june": return "-06-";
            case "july": return "-07-";
            case "august": return "-08-";
            case "september": return "-09-";
            case "october": return "-10-";
            case "november": return "-11-";
            case "december": return "-12-";
            default: return null;
        }
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

    // UPDATE (STUDENT-OWNED EVENT)
    public Event updateEventForStudent(String id, Event updated, String rollNumber) {
        Event event = repo.findById(id).orElseThrow();

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

    // DELETE (STUDENT-OWNED EVENT)
    public String deleteEventForStudent(String id, String rollNumber) {
        Event event = repo.findById(id).orElseThrow();

        if (!event.getRollNumber().equals(rollNumber)) {
            throw new RuntimeException("Unauthorized");
        }

        repo.deleteById(id);
        return "Deleted successfully";
    }
}
