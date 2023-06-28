const createError = require("http-errors");
const { ObjectId } = require("mongodb");
const Event = require("./models/event");
const userModel = require("./models/user");
const { v4: uuidv4 } = require("uuid");

// Post new event (name, date, description, ID)
// Post new event (name, date, description, ID)
exports.addEvent = async (req, res, next) => {
  if (!req.body.name || !req.body.date || !req.body.description) {
    return next(createError(400, "A name, date and description is required"));
  }

  // Check if the provided date is valid
  const date = new Date(req.body.date);
  if (isNaN(date.getTime())) {
    return next(createError(400, "Invalid date format"));
  }

  try {
    const event = new Event({
      name: req.body.name,
      date: date,
      description: req.body.description,
    });
    await event.save();
    res.send({
      message: `${req.body.name} on ${
        date.toISOString().split("T")[0]
      } has been added to the event list.`,
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

// Register function (authentication)
exports.register = async (req, res, next) => {
  // check for username and password in request body
  if (!req.body.username || !req.body.password) {
    return next(
      createError(400, "Please ensure that you have filled in all the fields.")
    );
  }

  // check if a user with the given username already exists
  const existingUser = await userModel.findOne({ username: req.body.username });
  if (existingUser) {
    return next(createError(400, "A user with this username already exists."));
  }

  // create new user
  const user = new userModel({
    username: req.body.username,
    password: req.body.password,
    token: uuidv4(),
  });
  await user.save();

  // send token to the client
  res.send({ token: user.token });
};

// User
// "username": "Test"
// "password": "1"

// Login in user
exports.login = async (req, res, next) => {
  const user = await userModel.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!user) {
    return next(createError(401, "This is not a user."));
  } else if (user) {
    console.log("User logged in");
    res.send({ token: user.token });
  }
};
