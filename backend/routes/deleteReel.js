const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");

router.delete("/deleteReel", async (req, res) => {
  const { reelId } = req.body;
  try {
    const reel = await Reel.findOneAndDelete({ _id: reelId });
    if (reel) {
      return res.status(200).send({ message: "Reel Deleted Successfully" });
    } else {
      return res.status(404).send({ message: "Reel Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
