const mongoose = require("mongoose");

const troubleShootingStepsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deviceId: { type: String, required: true },
  categoryId: { type: String, required: true },
  issueId: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model(
  "troubleShootingSteps",
  troubleShootingStepsSchema
);
