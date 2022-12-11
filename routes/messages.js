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
    const allMessages = await Messages.find({});
    for (let i = 0; i < allMessages.length; i++) {
      const from = await Users.find({ _id: allMessages[i].from });
      const to = await Users.find({ _id: allMessages[i].to });
      messages.push({ ...allMessages[i]._doc, from, to });
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
    const { description, deviceModal, deviceId, issueId } = req.body;
    // Validate user input
    if (!description || !deviceModal || !deviceId) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const ticket = await Tickets.create({
      clientDeviceModel: deviceModal,
      description,
      deviceId,
      issueId,
      userId: req.user.user_id,
    });
    if (ticket) {
      return res.status(201).json({
        status: "success",
        msg: "Ticket submitted successfull!",
        ticket,
      });
    } else {
      return res.status(400).json({
        status: "Error",
        msg: "Something went wrong, try again later",
      });
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { to, message } = req.body;
    // Validate user input
    if (!from || !to || !message) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const msg = await Messages.create({
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
    console.log(JSON.stringify(err));
    res.status(400).send({
      msg: err.message,
    });
  }
});

module.exports = router;
