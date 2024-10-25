const express = require("express");
const router = express.Router();
const Reel = require("../models/reelsModel");
require("../models/userModel");

router.get("/getReel", async (req, res) => {
  const { reelId } = req.body;
  try {
    const reel = await Reel.findById(reelId).populate(
      "user",
      "name profileImage"
    );

    if (reel) {
      return res.status(200).send(reel);
    } else {
      return res.status(404).send({ message: "Reel Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
