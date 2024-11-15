const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Reel = require("../models/reelsModel");

const sortReels = (reels) => {
  return reels.sort((a, b) => {
    const totalLikesPriority = 1;
    const dailyLikesPriority = 2;
    const commentsPriority = 1.5;
    const lowEngagementLimit = 10;

    // Score based on totalLikes, dailyLikes, and comments length
    const scoreA =
      a.totalLikes * totalLikesPriority +
      a.dailyLikes * dailyLikesPriority +
      a.comments?.length * commentsPriority;
    const scoreB =
      b.totalLikes * totalLikesPriority +
      b.dailyLikes * dailyLikesPriority +
      b.comments?.length * commentsPriority;

    // Check if both scores are low, and prioritize lower ones randomly
    if (scoreA < lowEngagementLimit && scoreB < lowEngagementLimit) {
      return Math.random() - 0.5; // Randomly sort low engagement reels
    }

    // Sort by score
    return scoreB - scoreA; // Higher scores come first
  });
};

router.get("/getAllReels", async (req, res) => {
  try {
    const { start = 0, limit = 3 } = req.query; // Default to 0 and 3 if not provided
    const reels = await Reel.find().populate("user", "name profileImage");

    if (reels && reels.length > 0) {
      const allReels = sortReels(reels);
      const slicedReels = allReels.slice(
        parseInt(start),
        parseInt(start) + parseInt(limit)
      );

      return res.status(200).send({ allReels: slicedReels });
    } else {
      return res.status(404).send({ message: "No Reels Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
