const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");
const User = require("../models/userModel");

router.get("/getComments", async (req, res) => {
  const { reelId } = req.query;
  try {
    const reel = await Reel.findById(reelId).populate(
      "comments",
      "comment name profileImage"
    );

    if (reel) {
      return res.status(200).send(reel.comments);
    } else {
      return res.status(404).send({ message: "Reel Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
