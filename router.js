const express = require("express");
const router = express.Router();
const events = require("./eventController.js");

// Return all events
router.get("/events", events.getEvents);

// Add an event (Title, date, description, an ID)
router.post("/events/post", events.addEvent);

// Remove event from the list
router.delete("/events/deleteall", events.deleteAllEvents);

// Edit event by ID
router.put("/events/edit/:id", events.updateEvent);

// Get event by ID
router.get("/events/:id", events.getEvent);

// Delete events by ID
router.delete("/events/delete/:id", events.deleteEvent);

// Login function (authentication)
router.post("/login", events.login);

// Register function (authentication)
router.post("/register", events.register);

module.exports = router;
