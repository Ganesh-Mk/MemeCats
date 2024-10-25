const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.delete("/deleteUser", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      await User.deleteOne({ email });
      return res.status(200).send({ message: "User Deleted Successfully" });
    } else {
      return res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
