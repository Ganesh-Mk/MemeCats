const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");
const User = require("../models/userModel");

router.post("/comment", async (req, res) => {
  const { reelId, comment, name, profileImage } = req.body;
  try {
    const reel = await Reel.findOne({ _id: reelId });
    if (reel) {
      const newComment = {
        comment,
        name,
        profileImage,
      };
      reel.comments.push(newComment);
      await reel.save();
      return res.status(200).send(reel.comments);
    } else {
      return res.status(404).send({ message: "Reel Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
