const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

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
      a.comments.length * commentsPriority;
    const scoreB =
      b.totalLikes * totalLikesPriority +
      b.dailyLikes * dailyLikesPriority +
      b.comments.length * commentsPriority;

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
    const users = await User.find().populate("reels");

    if (users) {
      let allReels = users.flatMap((user) => user.reels);
      allReels = sortReels(allReels);
      return res.status(200).send({ allReels });
    } else {
      return res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
