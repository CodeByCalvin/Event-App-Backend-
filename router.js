const express = require("express");
const router = express.Router();
const events = require("./eventController.js");

// Return all events
router.get("/events", events.getEvents);

// Add an event (Title, date, description, an ID)
router.post("/events/post", events.addEvent);

// Remove books from the list
router.delete("/events/deleteall", events.deleteAllEvents);

// Edit book listings
router.put("/events/edit/:id", events.updateEvent);

// Return books by ID
router.get("/events/:id", events.getEvent);

// Delete books by ID
router.delete("/events/delete/:id", events.deleteEvent);

module.exports = router;
