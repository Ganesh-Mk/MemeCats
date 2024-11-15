const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");
const User = require("../models/userModel");

router.post("/updateReelLikes", (req, res) => {
  const { reelId, totalLikes, dailyLikes } = req.body;

  // Update the reel's like counts only
  Reel.findByIdAndUpdate(
    reelId,
    {
      totalLikes: totalLikes,
      dailyLikes: dailyLikes,
    },
    { new: true } // Returns the updated document
  )
    .then((updatedReel) => {
      res.send({
        message: "Reel like counts updated successfully",
      });
    })
    .catch((err) => {
      console.error("Error updating reel:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
