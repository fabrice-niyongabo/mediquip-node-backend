const mongoose = require("mongoose");

const stepItemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
  stepId: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("stepItems", stepItemSchema);
