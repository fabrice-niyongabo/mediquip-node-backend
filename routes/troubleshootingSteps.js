const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const TroubleShootingSteps = require("../model/troubleshootingSteps");
const StepItems = require("../model/stepItems");

router.get("/", auth, async (req, res) => {
  try {
    const troubleShootingSteps = await TroubleShootingSteps.find({});
    return res.status(201).json({
      status: "success",
      troubleShootingSteps,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.get("/:issueId", auth, async (req, res) => {
  try {
    const issueId = req.params["issueId"];
    const troubleShootingSteps = await TroubleShootingSteps.find({ issueId });
    return res.status(201).json({
      status: "success",
      troubleShootingSteps,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.get("/stepItems/:stepId", auth, async (req, res) => {
  try {
    const stepId = req.params["stepId"];
    const stepItems = await StepItems.find({ stepId });
    return res.status(200).json({
      status: "success",
      stepItems,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

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

router.put("/", auth, async (req, res) => {
  try {
    const { title, stepId } = req.body;
    // Validate user input
    if (!title || !stepId) {
      return res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }

    const step = await TroubleShootingSteps.updateOne(
      {
        _id: stepId,
      },
      { title }
    );
    if (step) {
      return res.status(201).json({
        status: "success",
        msg: "Step title updated successfull!",
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

router.delete("/stepItems/:id", auth, async (req, res) => {
  try {
    const id = req.params["id"];
    const newCategory = await StepItems.deleteOne({
      _id: id,
    });

    if (newCategory) {
      return res.status(201).json({
        status: "success",
        msg: "Step Item deleted successfull!",
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
