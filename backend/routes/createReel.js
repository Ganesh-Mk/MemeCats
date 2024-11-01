const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Reel = require("../models/reelsModel");

router.post("/createReel", async (req, res) => {
  const { email, reelUrl, desc } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const newReel = new Reel({
        user: user._id,
        reelUrl,
        desc,
      });

      await newReel.save();
      user.reels.push(newReel._id);
      await user.save();
      return res.status(200).send({
        message: "Reel Created Successfully",
      });
    } else {
      return res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
