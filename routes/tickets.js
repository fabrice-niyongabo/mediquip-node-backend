const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Tickets = require("../model/tickets");
const SolvedProblems = require("../model/solvedProblems");

router.get("/", auth, async (req, res) => {
  try {
    const tickets = await Tickets.find({});
    return res.status(201).json({
      status: "success",
      tickets,
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

router.post("/solved/", auth, async (req, res) => {
  try {
    const { estimatedTime, serialNumber, deviceModal, deviceId, issueId } =
      req.body;
    // Validate user input
    if (!serialNumber || !deviceModal || !deviceId) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const ticket = await SolvedProblems.create({
      clientDeviceModel: deviceModal,
      estimatedTime,
      serialNumber,
      deviceId,
      issueId,
      userId: req.user.user_id,
    });
    if (ticket) {
      return res.status(201).json({
        status: "success",
        msg: "Thank for using this app.",
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

module.exports = router;
