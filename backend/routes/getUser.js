const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/getUser", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email })
      .populate({
        path: "saveReels",
        select: "_id reelUrl desc dailyLikes totalLikes",
        populate: {
          path: "user",
          select: "name profileImage",
        },
      })
      .populate("reels");

    if (user) {
      res.status(200).send({
        message: "Successfully",
        user: user,
        savedReels: user.saveReels, // Include this to make it easier to access on the client side
      });
    } else {
      res.status(401).send({ message: "User doesn't exist" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
