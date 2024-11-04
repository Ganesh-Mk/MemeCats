const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/getUser", async (req, res) => {
  const { email } = req.body;

  console.log("Email: ", email);
  try {
    const user = await User.findOne({ email })
      .populate("reels")
      .populate("saveReels");

    if (user) {
      res.status(200).send({ message: "Sucessfully", user: user });
    } else {
      res.status(401).send({ message: "User doesn't exist" });
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

module.exports = router;
