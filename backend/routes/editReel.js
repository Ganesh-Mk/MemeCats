const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");

router.patch("/editReel", async (req, res) => {
  const { reelId, reelUrl, desc } = req.body;
  try {
    const reel = await Reel.findById(reelId);
    if (reel) {
      if (reelUrl) reel.reelUrl = reelUrl;
      if (desc) reel.desc = desc;
      await reel.save();
      return res.status(200).send({ message: "Reel edited successfully" });
    } else {
      return res.status(404).send({ message: "Reel not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err.message });
  }
});

module.exports = router;
