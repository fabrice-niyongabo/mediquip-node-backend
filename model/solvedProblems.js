const mongoose = require("mongoose");

const solvedProblemsSchema = new mongoose.Schema({
  clientDeviceModel: { type: String, required: true },
  serialNumber: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  estimatedPrice: { type: String, required: true },
  deviceId: { type: String, required: true },
  issueId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("solvedProblems", solvedProblemsSchema);
