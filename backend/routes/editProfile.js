const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.patch("/editProfile", async (req, res) => {
  const { name, email } = req.body;

  console.log(name, email);
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (name) user.name = name;
      await user.save();
      res.status(200).send({ message: "Edited Successfully", user: user });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    res.status(500).send({ message: "An error occurred" });
  }
});

module.exports = router;
