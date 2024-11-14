const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/saveReel", async (req, res) => {
  const { reelId, userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.saveReels.push(reelId);
      await user.save();
      return res.status(200).send({ message: "Reel Saved Successfully" });
    } else {
      return res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
