const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  token: { type: String },
  password: { type: String, default: "-", required: true },
  fullName: { type: String, default: "-", required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, default: "user", required: true },
  otp: { type: String, default: "-", required: true },
  otpUsed: { type: Boolean, default: false, required: true },
  companyName: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("users", userSchema);
