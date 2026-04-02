package com.example.eventservice.controller;

import com.example.eventservice.model.Event;
import com.example.eventservice.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin("*")
public class EventController {

    @Autowired
    private EventService service;

    // ADD
    @PostMapping("/add")
    public Event add(@RequestBody Event event) {
        return service.addEvent(event);
    }

    // STUDENT VIEW
    @GetMapping("/student/{rollNumber}")
    public List<Event> getStudentEvents(@PathVariable String rollNumber) {
        return service.getByRollNumber(rollNumber);
    }

    // FACULTY VIEW BY MONTH
    @GetMapping("/faculty/{facultyId}/{month}")
    public List<Event> getByMonth(@PathVariable String facultyId,
                                  @PathVariable String month) {
        return service.getByMonth(facultyId, month);
    }

    // UPDATE
    @PutMapping("/update/{id}/{facultyId}")
    public Event update(@PathVariable String id,
                        @PathVariable String facultyId,
                        @RequestBody Event event) {
        return service.updateEvent(id, event, facultyId);
    }

    // DELETE
    @DeleteMapping("/delete/{id}/{facultyId}")
    public String delete(@PathVariable String id,
                         @PathVariable String facultyId) {
        return service.deleteEvent(id, facultyId);
    }
}