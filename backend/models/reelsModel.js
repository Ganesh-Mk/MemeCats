const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const reelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reelUrl: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    default: "",
  },
  dailyLikes: {
    type: Number,
    default: 0,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
});

module.exports = mongoose.model("Reel", reelSchema);
