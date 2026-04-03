package com.example.eventservice.controller;

import com.example.eventservice.model.Event;
import com.example.eventservice.security.JwtUser;
import com.example.eventservice.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin("*")
public class EventController {

    @Autowired
    private EventService service;

    private void requireRole(JwtUser user, String role) {
        if (user == null || user.getRole() == null || !user.getRole().equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    // ADD
    @PostMapping("/add")
    public Event add(@RequestBody Event event, @AuthenticationPrincipal JwtUser user) {
        if (user == null || user.getRole() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
        if ("student".equalsIgnoreCase(user.getRole())) {
            if (event.getRollNumber() == null || !event.getRollNumber().equals(user.getRollNumber())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Roll number mismatch");
            }
        }
        if ("faculty".equalsIgnoreCase(user.getRole())) {
            if (event.getFacultyId() == null || event.getFacultyId().isBlank()) {
                event.setFacultyId(user.getFacultyId());
            } else if (!event.getFacultyId().equals(user.getFacultyId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty ID mismatch");
            }
        }
        return service.addEvent(event);
    }

    // STUDENT VIEW
    @GetMapping("/student/{rollNumber}")
    public List<Event> getStudentEvents(@PathVariable String rollNumber,
                                        @AuthenticationPrincipal JwtUser user) {
        requireRole(user, "student");
        if (!rollNumber.equals(user.getRollNumber())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Roll number mismatch");
        }
        return service.getByRollNumber(rollNumber);
    }

    // FACULTY VIEW BY MONTH
    @GetMapping("/faculty/{facultyId}/{month}")
    public List<Event> getByMonth(@PathVariable String facultyId,
                                  @PathVariable String month,
                                  @AuthenticationPrincipal JwtUser user) {
        requireRole(user, "faculty");
        if (!facultyId.equals(user.getFacultyId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty ID mismatch");
        }
        return service.getByMonth(facultyId, month);
    }

    // UPDATE
    @PutMapping("/update/{id}/{facultyId}")
    public Event update(@PathVariable String id,
                        @PathVariable String facultyId,
                        @RequestBody Event event,
                        @AuthenticationPrincipal JwtUser user) {
        requireRole(user, "faculty");
        if (!facultyId.equals(user.getFacultyId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty ID mismatch");
        }
        return service.updateEvent(id, event, facultyId);
    }

    // UPDATE (STUDENT-OWNED EXTERNAL EVENT)
    @PutMapping("/student/update/{id}/{rollNumber}")
    public Event updateForStudent(@PathVariable String id,
                                  @PathVariable String rollNumber,
                                  @RequestBody Event event,
                                  @AuthenticationPrincipal JwtUser user) {
        requireRole(user, "student");
        if (!rollNumber.equals(user.getRollNumber())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Roll number mismatch");
        }
        event.setRollNumber(rollNumber);
        return service.updateEventForStudent(id, event, rollNumber);
    }

    // DELETE
    @DeleteMapping("/delete/{id}/{facultyId}")
    public String delete(@PathVariable String id,
                         @PathVariable String facultyId,
                         @AuthenticationPrincipal JwtUser user) {
        requireRole(user, "faculty");
        if (!facultyId.equals(user.getFacultyId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty ID mismatch");
        }
        return service.deleteEvent(id, facultyId);
    }

    // DELETE (STUDENT-OWNED EXTERNAL EVENT)
    @DeleteMapping("/student/delete/{id}/{rollNumber}")
    public String deleteForStudent(@PathVariable String id,
                                   @PathVariable String rollNumber,
                                   @AuthenticationPrincipal JwtUser user) {
        requireRole(user, "student");
        if (!rollNumber.equals(user.getRollNumber())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Roll number mismatch");
        }
        return service.deleteEventForStudent(id, rollNumber);
    }
}
