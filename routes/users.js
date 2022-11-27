const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");

const Users = require("../model/users");
const { randomNumber } = require("../helpers");

router.get("/", auth, async (req, res) => {
  try {
    const users = await Users.find({ role: "user" });
    return res.status(200).send({ msg: "Fetched users successfully!", users });
  } catch (err) {
    return res.status(400).send({
      msg: "Something went wrong while signing into your account. Try again later",
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { email, companyName } = req.body;

    if (!(email && companyName)) {
      return res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const oldUser = await Users.findOne({ email });
    if (oldUser) {
      return res.status(409).send({ msg: "User's Email already exists." });
    }
    const user = await Users.create({
      email: email.toLowerCase(),
      otp: randomNumber(),
      companyName,
    });
    return res.status(200).send({ msg: "User created successfull", user });
  } catch (err) {
    return res.status(400).send({
      msg: "Something went wrong while signing into your account. Try again later",
    });
  }
});

router.post("/otp/", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!(email && otp)) {
      return res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }
    const oldUser = await Users.findOne({ email, otp, otpUsed: false });
    if (oldUser) {
      return res
        .status(200)
        .send({ msg: "OTP Validated for " + oldUser.email });
    }
    return res
      .status(400)
      .send({ msg: "Invalid OTP, Please contact admin for more info." });
  } catch (err) {
    return res.status(400).send({
      msg: "Something went wrong while signing into your account. Try again later",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res
        .status(400)
        .send({ msg: "Please provide your email and password" });
    }
    // Validate if user exist in our database
    const user = await Users.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
          role: user.role,
          phone: user.phone,
          createdAt: user.createdAt,
          companyName: user.companyName,
          fullName: user.fullName,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json({
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        role: user.role,
        id: user._id,
        token: user.token,
      });
    } else {
      return res.status(400).send({ msg: "Wrong username or password" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: "Something went wrong while signing into your account. Try again later",
    });
  }
});

router.post("/updatePassword/", auth, async (req, res) => {
  const { newPwd, currentPwd } = req.body;
  try {
    const user = await Users.findOne({ _id: req.user.user_id });
    if (user && (await bcrypt.compare(currentPwd, user.password))) {
      encryptedPassword = await bcrypt.hash(newPwd, 10);
      Users.updateOne(
        { _id: req.user.user_id },
        { password: encryptedPassword },
        (err, result) => {
          if (err) {
            return res.status(400).send({ msg: err.message });
          } else {
            return res.status(200).send({ result, msg: "Password updated!" });
          }
        }
      );
    } else {
      return res.status(400).send({ msg: "Wrong old password" });
    }
  } catch (err) {
    return res.status(400).send({
      msg: "Something went wrong. Try again later",
    });
  }
});

router.post("/updateUserInfo/", auth, async (req, res) => {
  const { fullName } = req.body;
  try {
    const user = await Users.updateOne({ _id: req.user.user_id }, { fullName });
    if (user) {
      return res.status(201).send({ msg: "User updated!" });
    } else {
      return res.status(400).send({
        msg: "Something went wrong, please try again later after some time.",
      });
    }
  } catch (err) {
    return res.status(400).send({
      msg: "Something went wrong. Try again later. " + err.message,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    // Get user input
    const { fullName, email, password, otp } = req.body;

    // Validate user input
    if (!(email && password && fullName, otp)) {
      return res.status(400).send({
        status: "Error",
        msg: "Provide correct info",
      });
    }

    const oldUser = await Users.findOne({ email, otp, otpUsed: false });

    if (oldUser) {
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await Users.updateOne(
        { _id: oldUser._id },
        {
          fullName,
          password: encryptedPassword,
          otpUsed: true,
        }
      );
      // Create token
      const token = jwt.sign(
        {
          user_id: oldUser._id,
          email: oldUser.email,
          fullName,
          role: oldUser.role,
          companyName: oldUser.companyName,
          createdAt: oldUser.createdAt,
        },
        process.env.TOKEN_KEY,
        {
          // expiresIn: "2h",
        }
      );

      // return new user
      return res.status(201).json({
        status: "success",
        msg: "User Account Activate successfull!",
        email: oldUser.email,
        fullName,
        companyName: oldUser.companyName,
        role: oldUser.role,
        token: token,
        id: oldUser._id,
      });
    }

    return res.status(400).send({ msg: "Invalid user details." });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      msg: err.message,
    });
  }
});

module.exports = router;
