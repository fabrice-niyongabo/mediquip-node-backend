const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Messages = require("../model/messages");
const Users = require("../model/users");

router.get("/", async (req, res) => {
  try {
    const messages = [];
    // const allMessages = await Messages.find({}).sort({ date: -1 });
    const allMessages = await Messages.find({});
    for (let i = 0; i < allMessages.length; i++) {
      const from = await Users.findOne({ _id: allMessages[i].from });
      const to = await Users.findOne({ _id: allMessages[i].to });
      messages.push({ ...allMessages[i]._doc, from, to, index: i });
    }
    return res.status(200).json({
      status: "success",
      messages,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { to, message, type } = req.body;
    // Validate user input
    if (!to || !message || !type) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const msg = await Messages.create({
      type,
      to,
      message,
      from: req.user.user_id,
    });
    if (msg) {
      return res.status(201).json({
        status: "success",
        msg: "Message sent.",
        msg,
      });
    } else {
      return res.status(400).json({
        status: "Error",
        msg: "Something went wrong, try again later",
      });
    }
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

module.exports = router;
