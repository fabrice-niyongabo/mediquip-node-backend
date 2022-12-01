const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const Devices = require("../model/devices");
const TroubleShootingCategories = require("../model/troubleShootingCategories");
const DeviceIssues = require("../model/deviceIssues");
const TroubleShootingSteps = require("../model/troubleshootingSteps");
const StepItems = require("../model/stepItems");

router.get("/", auth, async (req, res) => {
  try {
    const db = [];
    const devices = await Devices.find({});
    for (let i = 0; i < devices.length; i++) {
      const troubleShootingCategories = await TroubleShootingCategories.find({
        deviceId: devices[i]._id,
      });
      const deviceIssues = await DeviceIssues.find({
        deviceId: devices[i]._id,
      });
      const troubleshootingSteps = await TroubleShootingSteps.find({
        deviceId: devices[i]._id,
      });
      const stepItems = await StepItems.find({});
      db.push({
        ...devices[i]._doc,
        troubleShootingCategories,
        deviceIssues,
        troubleshootingSteps,
        stepItems,
      });
    }

    return res.status(201).json({
      status: "success",
      db,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

module.exports = router;
