const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  token: { type: String },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, default: "user", required: true },
  companyName: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("users", userSchema);
