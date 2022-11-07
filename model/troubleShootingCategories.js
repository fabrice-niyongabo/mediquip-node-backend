const mongoose = require("mongoose");

const troubleShootingCategoriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deviceId: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model(
  "troubleShootingCategories",
  troubleShootingCategoriesSchema
);
