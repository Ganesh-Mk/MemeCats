const mongoose = require("mongoose");

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
    default:
      "https://static-00.iconduck.com/assets.00/cat-symbol-icon-256x256-jqp15brc.png",
  },
  saveReels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
    },
  ],
  likedReels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
    },
  ],
  reels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
