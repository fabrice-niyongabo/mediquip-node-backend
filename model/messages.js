const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "text", required: true },
  seen: { type: String, default: false, required: true },
  date: { type: String, default: new Date(), required: true },
});

module.exports = mongoose.model("messages", messageSchema);
