const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    default: "TBC",
  },
});

module.exports = mongoose.model("Event", eventSchema);
