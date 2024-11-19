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
    const { start = 0, limit = 5, shuffle } = req.query;
    let reels = await Reel.find().populate("user", "name profileImage");

    if (reels && reels.length > 0) {
      let allReels = sortReels(reels);

      // Shuffle the reels if user refresh
      if (shuffle === "true") {
        allReels = allReels.sort(() => Math.random() - 0.5);
      }

      // Handle the case when start + limit exceeds the number of reels
      const startIndex = parseInt(start);
      const limitIndex = parseInt(limit);

      // If start index is greater than or equal to the length of reels, reset start to 0
      const adjustedStart = startIndex >= allReels.length ? 0 : startIndex;

      // Slice the reels to get the requested range
      const slicedReels = allReels.slice(
        adjustedStart,
        adjustedStart + limitIndex
      );

      // If the slice exceeds the length of the array, loop back from the beginning
      if (slicedReels.length < limitIndex) {
        const remainingReels = allReels.slice(
          0,
          limitIndex - slicedReels.length
        );
        return res
          .status(200)
          .send({ allReels: [...slicedReels, ...remainingReels] });
      }

      return res.status(200).send({ allReels: slicedReels });
    } else {
      return res.status(404).send({ message: "No Reels Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
