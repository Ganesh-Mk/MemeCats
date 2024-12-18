const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.delete("/deleteSavedReel", async (req, res) => {
  const { reelId, userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      // Using $pull to remove reelId from saveReels array
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saveReels: reelId } }, // Pull out the reelId from saveReels array
        { new: true } // Return the updated user document (optional)
      );
      return res.status(200).send({ message: "Reel Deleted Successfully" });
    } else {
      return res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
