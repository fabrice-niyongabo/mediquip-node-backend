const mongoose = require("mongoose");

const sparepartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("spareparts", sparepartSchema);
