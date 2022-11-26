const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Transactions = require("../model/transactions2");

router.get("/", async (req, res) => {
  try {
    const transactions = await Transactions.find({});
    return res.status(201).json({
      status: "success",
      transactions,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const transaction = await Transactions.create(req.body);
    return res.status(201).json({
      status: "success",
      transaction,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

module.exports = router;
