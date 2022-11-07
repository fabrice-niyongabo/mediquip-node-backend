const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("devices", deviceSchema);
