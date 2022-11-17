const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const TroubleShootingSteps = require("../model/troubleshootingSteps");
const StepItems = require("../model/stepItems");

// router.get("/", auth, async (req, res) => {
//   try {
//     const troubleShootingCategories = await TroubleShootingCategories.find({});
//     return res.status(201).json({
//       status: "success",
//       troubleShootingCategories,
//     });
//   } catch (err) {
//     res.status(400).send({
//       msg: err.message,
//     });
//   }
// });

router.post("/", auth, async (req, res) => {
  try {
    const { title, deviceId, categoryId, issueId } = req.body;
    // Validate user input
    if (!title || !deviceId || !categoryId) {
      return res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if step already exist
    // Validate if device exist in our database
    const oldDevice = await TroubleShootingSteps.findOne({
      title,
      deviceId,
      categoryId,
      issueId,
    });
    if (oldDevice) {
      return res.status(400).send({ msg: "Step already exists." });
    }

    const step = await TroubleShootingSteps.create({
      title,
      deviceId,
      categoryId,
      issueId,
    });
    if (step) {
      return res.status(201).json({
        status: "success",
        msg: "Step added successfull!",
        step,
      });
    } else {
      return res.status(400).json({
        status: "Error",
        msg: "Something went wrong, try again later",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: err.message,
    });
  }
});

router.post("/stepItems/", auth, async (req, res) => {
  try {
    const { type, value, stepId } = req.body;
    // Validate user input
    if (!type || !value || !stepId) {
      return res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const newCategory = await StepItems.create({
      type,
      value,
      stepId,
    });
    if (newCategory) {
      return res.status(201).json({
        status: "success",
        msg: "Step Item saved successfull!",
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
