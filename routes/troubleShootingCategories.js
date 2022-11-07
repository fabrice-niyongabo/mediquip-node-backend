const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Devices = require("../model/devices");
const TroubleShootingCategories = require("../model/troubleShootingCategories");

router.get("/", auth, async (req, res) => {
  try {
    const troubleShootingCategories = await TroubleShootingCategories.find({});
    return res.status(201).json({
      status: "success",
      troubleShootingCategories,
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
    const device = await TroubleShootingCategories.deleteOne({ _id: id });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Category deleted!",
      });
    } else {
      return res.status(400).json({
        status: "Error",
        msg: "Something went wrong while delete specified category",
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
    const { name, deviceId } = req.body;
    // Validate user input
    if (!name) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if device already exist
    // Validate if device exist in our database
    const oldDevice = await Devices.findOne({ _id: deviceId });
    if (!oldDevice) {
      return res.status(400).send({ msg: "Device  does not exists." });
    }

    const oldcategory = await TroubleShootingCategories.findOne({
      deviceId,
      name,
    });
    if (oldcategory) {
      return res
        .status(400)
        .send({ msg: "Category name already exists on this device." });
    }

    const newCategory = await TroubleShootingCategories.create({
      name,
      deviceId,
    });
    if (newCategory) {
      return res.status(201).json({
        status: "success",
        msg: "Category added successfull!",
        newCategory,
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
