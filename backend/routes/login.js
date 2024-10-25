const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("reels");

    if (user) {
      if (user.password === password) {
        res.status(200).send({ message: "Login Successful", user: user });
      } else {
        res.status(401).send({ message: "Password didn't match" });
      }
    } else {
      res.status(401).send({ message: "User doesn't exist" });
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

module.exports = router;
