const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const SparePrarts = require("../model/spareParts");

router.get("/", auth, async (req, res) => {
  try {
    const spareparts = await SparePrarts.find({});
    return res.status(201).json({
      status: "success",
      spareparts,
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
    const device = await SparePrarts.deleteOne({ _id: id });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Spare part deleted!",
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
    const { name, model, price } = req.body;
    // Validate user input
    if (!(name && model && price)) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if device already exist
    // Validate if device exist in our database
    const oldDevice = await SparePrarts.findOne({ name, model, price });
    if (oldDevice) {
      return res.status(400).send({ msg: "Spare part already exists." });
    }
    const device = await SparePrarts.create({
      name,
      model,
      price,
    });
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Spare part recorded successfull!",
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

router.put("/", auth, async (req, res) => {
  try {
    const { name, model, price, id } = req.body;
    // Validate user input
    if (!(name && model && price && id)) {
      res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    // check if device already exist

    const device = await SparePrarts.updateOne(
      {
        _id: id,
      },
      { name, model, price }
    );
    if (device) {
      return res.status(201).json({
        status: "success",
        msg: "Spare part updated successfull!",
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
