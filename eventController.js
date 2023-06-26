const createError = require("http-errors");
const { EventModel } = require("./models/event");

// Get all events
exports.getEvents = async (req, res, next) => {
  try {
    const events = await EventModel.find();
    res.send(events);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

// Post new event (name, date, description)
exports.addEvent = async (req, res, next) => {
  if (!req.body.name || !req.body.date || !req.body.description) {
    return next(createError(400, "A name, date and description is required"));
  }
  try {
    const event = new EventModel({
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

// Delete event by ID
exports.deleteEvent = async (req, res) => {
  await Event.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Event removed." });
};

// Delete all events
exports.deleteAllEvents = async (req, res, next) => {
  try {
    await EventModel.deleteMany({});
    res.send({ message: "All the books have been deleted" });
  } catch (error) {
    return next(createError(400, "Error deleting the books", error));
  }
};
// Update event by ID
exports.updateEvent = async (req, res) => {
  await Event.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Event updated." });
};

// Get event by ID
exports.getEvent = async (req, res) => {
  const event = await Event.findOne({ _id: ObjectId(req.params.id) });
  res.send(event);
};
