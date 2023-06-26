const createError = require("http-errors");
const Event = require("./models/event");
const { ObjectId } = require("mongodb");

// Post new event (name, date, description, ID)
exports.addEvent = async (req, res, next) => {
  if (!req.body.name || !req.body.date || !req.body.description) {
    return next(createError(400, "A name, date and description is required"));
  }
  try {
    const event = new Event({
      name: req.body.name,
      date: req.body.date,
      description: req.body.description,
    });
    await event.save();
    res.send({
      message: `${req.body.name} on ${req.body.date} has been added to the event list.`,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

// Get all events
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

// Get event by ID
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ _id: new ObjectId(req.params.id) });
    if (!event) {
      return next(createError(404, "Event not found"));
    }
    res.send(event);
  } catch (error) {
    return next(createError(400, "Error finding the event", error));
  }
};

// Edit event by ID
exports.updateEvent = async (req, res, next) => {
  if (!req.body.name && !req.body.date && !req.body.description) {
    return next(
      createError(400, "Event details are required to make a change.")
    );
  }

  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          date: req.body.date,
          description: req.body.description,
        },
      },
      { new: true }
    );

    if (!event) {
      return next(createError(404, "Event not found"));
    }

    res.send({
      message: `Updated title to "${event.name}" (ID: ${event.id}).`,
    });
  } catch (error) {
    return next(createError(500, "Error updating the event", error));
  }
};

// Delete event by ID
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return next(createError(404, "Event not found"));
    }
    res.send({
      message: `Event '${event.name}' (ID ${req.params.id}) has been deleted.`,
    });
  } catch (error) {
    return next(createError(400, "Error deleting the event", error));
  }
};

// Delete all events
exports.deleteAllEvents = async (req, res, next) => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      return next(createError(404, "No events found."));
    } else if (count > 0) {
      await Event.deleteMany({});
      res.send({ message: `All ${count} events have been deleted.` });
    }
  } catch (error) {
    return next(createError(400, "Error deleting the events", error));
  }
};
