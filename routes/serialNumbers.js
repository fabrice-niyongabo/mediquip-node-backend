const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const SerialNumbres = require("../model/serialNumbers");

router.get("/", auth, async (req, res) => {
  try {
    const serialNumbers = await SerialNumbres.find({});
    return res.status(201).json({
      status: "success",
      serialNumbers,
    });
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params["id"];
    const device = await SerialNumbres.deleteOne({ _id: id });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Serial number deleted!",
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

router.post("/", auth, async (req, res) => {
  try {
    const { sn } = req.body;
    // Validate user input
    if (!sn) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if device already exist
    // Validate if device exist in our database
    const oldDevice = await SerialNumbres.findOne({ sn });
    if (oldDevice) {
      return res.status(400).send({ msg: "Serial Number already exists." });
    }
    const device = await SerialNumbres.create({
      sn,
    });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Serial number recorded successfull!",
        serialNumber: device,
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

router.put("/", auth, async (req, res) => {
  try {
    const { sn, id } = req.body;
    // Validate user input
    if (!(sn && id)) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if device already exist

    const device = await SerialNumbres.updateOne(
      {
        _id: id,
      },
      { sn }
    );
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Serial number updated successfull!",
        device,
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
