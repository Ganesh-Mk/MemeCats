const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/getUser", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email })
      .populate({
        path: "saveReels",
        populate: {
          path: "user",
          select: "name profileImage",
        },
      })
      .populate("likedReels")
      .populate("reels");

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
