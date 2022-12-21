const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Tickets = require("../model/tickets");
const SolvedProblems = require("../model/solvedProblems");
const Users = require("../model/users");
const Issues = require("../model/deviceIssues");
const Devices = require("../model/devices");

router.get("/", auth, async (req, res) => {
  try {
    const tickets = [];
    const tics = await Tickets.find({});
    for (let i = 0; i < tics.length; i++) {
      const user = await Users.findOne({ _id: tics[i].userId });
      tickets.push({ ...tics[i]._doc, user });
    }
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
    const {
      estimatedTime,
      estimatedPrice,
      serialNumber,
      deviceModal,
      deviceId,
      issueId,
    } = req.body;
    // Validate user input
    if (!serialNumber || !deviceModal || !deviceId || !estimatedPrice) {
      return res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const ticket = await SolvedProblems.create({
      clientDeviceModel: deviceModal,
      estimatedTime,
      estimatedPrice,
      serialNumber,
      deviceId,
      issueId,
      userId: req.user.user_id,
    });
    if (ticket) {
      return res.status(201).json({
        status: "success",
        msg: "Thank you for using this app.",
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

router.get("/solved/", auth, async (req, res) => {
  try {
    const solved = [];
    const tic = await SolvedProblems.find({});
    for (let i = 0; i < tic.length; i++) {
      const user = await Users.findOne({ _id: tic[i].userId });
      const issue = await Issues.findOne({ _id: tic[i].issueId });
      const device = await Devices.findOne({ _id: tic[i].deviceId });
      solved.push({ ...tic[i]._doc, user, issue, device });
    }
    return res.status(200).json({
      status: "success",
      msg: "Thank you for using this app.",
      solved,
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(400).send({
      msg: err.message,
    });
  }
});

module.exports = router;
