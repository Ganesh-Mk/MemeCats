const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");
const User = require("../models/userModel");

router.post("/updateReelLikes", (req, res) => {
  const { reelId, totalLikes, dailyLikes, userId, isLiked } = req.body;

  // Update the reel's like counts
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

      // If the user is liking the reel (isLiked = true), add it to likedReels array
      // If the user is unliking the reel (isLiked = false), remove it from likedReels array
      const updateOperation = isLiked
        ? { $addToSet: { likedReels: reelId } } // Add reelId to likedReels
        : { $pull: { likedReels: reelId } }; // Remove reelId from likedReels

      User.findByIdAndUpdate(
        userId,
        updateOperation, // Use the appropriate operation based on isLiked
        { new: true } // Return the updated user document
      )
        .then((updatedUser) => {
          console.log("Updated User: ", updatedUser);
          res.send({
            message: isLiked
              ? "Reel liked and user saved successfully"
              : "Reel unliked and user saved successfully",
          });
        })
        .catch((err) => {
          console.error("Error updating user:", err);
          res.status(500).json({ error: "Error updating user" });
        });
    })
    .catch((err) => {
      console.error("Error updating reel:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
