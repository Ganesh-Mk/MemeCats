const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Reel = require("../models/reelsModel");

router.get("/delete", (req, res) => {
  User.deleteMany({})
    .then(() => {
      Reel.deleteMany({})
        .then(() => {
          res.send("All data deleted successfully");
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
