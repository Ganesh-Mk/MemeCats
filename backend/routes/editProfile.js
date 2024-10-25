const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.patch("/editProfile", async (req, res) => {
  const { name, profileImage, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (name) user.name = name;
      if (profileImage) user.profileImage = profileImage;
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
