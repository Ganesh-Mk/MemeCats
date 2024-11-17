const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");

router.get("/getRanking", async (req, res) => {
  try {
    // Get the 'start' and 'end' range from query params
    const { start, end } = req.query;

    // If start or end are not provided, return a bad request error
    if (!start || !end) {
      return res
        .status(400)
        .send({ message: "Start and end values are required" });
    }

    // Fetching all the reels with user data populated
    const reels = await Reel.find()
      .populate("user", "name email profileImage")
      .sort({ dailyLikes: -1, totalLikes: -1, createdAt: 1 }); // Sorting by dailyLikes, totalLikes, and createdAt for tie-breaking

    // Ranking logic to handle same likes scenario
    const rankedReels = reels.map((reel) => ({
      name: reel.user.name,
      email: reel.user.email,
      profileImage: reel.user.profileImage,
      reelId: reel._id,
      dailyLikes: reel.dailyLikes,
      totalLikes: reel.totalLikes,
      reelDesc: reel.desc,
      reelUrl: reel.reelUrl,
    }));

    // Group by dailyLikes and totalLikes
    const groupedByLikes = rankedReels.reduce((acc, reel) => {
      const key = `${reel.dailyLikes}-${reel.totalLikes}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(reel);
      return acc;
    }, {});

    // if dailyLikes and totalLikes are same then sort by createdAt
    Object.keys(groupedByLikes).forEach((key) => {
      if (groupedByLikes[key].length > 1) {
        groupedByLikes[key] = groupedByLikes[key].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ); // Sort by createdAt
      }
    });

    // Flatten the array back after randomization
    const finalRanking = [].concat(...Object.values(groupedByLikes));

    if (parseInt(start) > finalRanking.length) {
      return res.status(400).send({ message: "Enough data" });
    }

    // Slice the final ranking based on the start and end range
    const paginatedRanking = finalRanking.slice(
      parseInt(start) - 1,
      parseInt(end)
    );

    return res.status(200).send(paginatedRanking);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
