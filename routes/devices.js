const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Devices = require("../model/devices");

router.get("/", auth, async (req, res) => {
  try {
    const devices = await Devices.find({});
    return res.status(201).json({
      status: "success",
      devices,
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
    const device = await Devices.deleteOne({ _id: id });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Device deleted!",
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
    const { name } = req.body;
    // Validate user input
    if (!name) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if device already exist
    // Validate if device exist in our database
    const oldDevice = await Devices.findOne({ name });
    if (oldDevice) {
      return res.status(400).send({ msg: "Device name already exists." });
    }
    const device = await Devices.create({
      name,
    });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Device recorded successfull!",
        device,
      });
    } else {
      return res.status(400).json({
        status: "Error",
        msg: "Something went wrong, try again later",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      msg: err.message,
    });
  }
});

module.exports = router;
