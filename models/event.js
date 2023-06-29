const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
    default: "TBC",
  },
});

module.exports = mongoose.model("Event", eventSchema);
