const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");
const User = require("../models/userModel");

router.delete("/deleteReel", async (req, res) => {
  const { reelId, userId } = req.body; // Assuming you send the user ID as well

  try {
    const reel = await Reel.findOneAndDelete({ _id: reelId });

    if (reel) {
      // Remove the reference from the User model
      await User.updateOne(
        { _id: userId },
        { $pull: { reels: reelId } } // Remove the reelId from the user's reel array
      );

      return res.status(200).send({ message: "Reel Deleted Successfully" });
    } else {
      return res.status(404).send({ message: "Reel Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
