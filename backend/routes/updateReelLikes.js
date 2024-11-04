const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");

router.post("/updateReelLikes", (req, res) => {
  const { reelId, totalLikes, dailyLikes } = req.body;

  Reel.findByIdAndUpdate(
    reelId,
    {
      totalLikes: totalLikes,
      dailyLikes: dailyLikes,
    },
    { new: true } // Returns the updated document
  )
    .then((updatedReel) => {
      console.log("Updated Reel: ", updatedReel);
      res.send({ message: "Reel likes updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
