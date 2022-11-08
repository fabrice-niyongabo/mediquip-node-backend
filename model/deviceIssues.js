const mongoose = require("mongoose");

const deviceIssuesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  deviceId: { type: String, required: true },
  categoryId: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("deviceIssues", deviceIssuesSchema);
