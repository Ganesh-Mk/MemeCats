const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");

router.get("/getRanking", async (req, res) => {
  try {
    // Fetching all the reels with user data populated
    const reels = await Reel.find()
      .populate("user", "name email profileImage")
      .sort({ dailyLikes: -1, totalLikes: -1 }); // Sorting by dailyLikes and then by totalLikes

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

    // Handling randomization when dailyLikes and totalLikes are the same
    const groupedByLikes = rankedReels.reduce((acc, reel) => {
      const key = `${reel.dailyLikes}-${reel.totalLikes}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(reel);
      return acc;
    }, {});

    // Randomize within the same dailyLikes and totalLikes
    Object.keys(groupedByLikes).forEach((key) => {
      if (groupedByLikes[key].length > 1) {
        groupedByLikes[key] = groupedByLikes[key].sort(
          () => Math.random() - 0.5
        ); // Random shuffle
      }
    });

    // Flatten the array back after randomization
    const finalRanking = [].concat(...Object.values(groupedByLikes));

    return res.status(200).send(finalRanking);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
