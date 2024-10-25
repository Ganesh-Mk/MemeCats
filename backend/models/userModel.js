const mongoose = require("mongoose");
const reelSchema = require("./reelsMode");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  reels: [reelSchema],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
