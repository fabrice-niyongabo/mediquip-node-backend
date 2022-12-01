const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema({
  clientDeviceModel: { type: String, required: true },
  description: { type: String, required: true },
  deviceId: { type: String, required: true },
  issueId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("tickets", ticketsSchema);
