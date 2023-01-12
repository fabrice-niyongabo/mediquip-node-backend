const mongoose = require("mongoose");

const serialNumberSchema = new mongoose.Schema({
  sn: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("serialNumbers", serialNumberSchema);
