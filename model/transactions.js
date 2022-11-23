const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String },
  statusDescription: { type: String },
  spTransactionId: { type: String },
  walletTransactionId: { type: String },
  chargedCommission: { type: String },
  currency: { type: String },
  paidAmount: { type: Number },
  transactionId: { type: String },
  statusCode: { type: String },
  status: { type: String },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("devices", deviceSchema);
