const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Devices = require("../model/devices");
const DeviceIssues = require("../model/deviceIssues");

router.get("/", auth, async (req, res) => {
  try {
    const issues = await DeviceIssues.find({});
    return res.status(201).json({
      status: "success",
      issues,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const device = await DeviceIssues.deleteOne({ _id: id });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Issue deleted!",
      });
    } else {
      return res.status(400).json({
        status: "Error",
        msg: "Something went wrong while delete specified device",
      });
    }
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.post("/add", auth, async (req, res) => {
  try {
    const { title, summary, deviceId, categoryId } = req.body;
    // Validate user input
    if (!title || !summary || !deviceId || !categoryId) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if device already exist
    // Validate if device exist in our database
    const oldDevice = await Devices.findOne({ _id: deviceId });
    if (!oldDevice) {
      return res.status(400).send({ msg: "Device doesnt exists." });
    }
    const newIssue = await DeviceIssues.create({
      title,
      summary,
      deviceId,
      categoryId,
    });
    if (newIssue) {
      return res.status(201).json({
        status: "success",
        msg: "Issue recorded successfull!",
        newIssue,
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
