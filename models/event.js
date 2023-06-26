const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: String,
  date: String,
  description: String,
});

module.exports.EventModel = mongoose.model("EventModel", eventSchema);
