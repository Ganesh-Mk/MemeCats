const mongoose = require("mongoose");
const commentSchema = require("./commentMode");

const reelSchema = new mongoose.Schema({
  desc: {
    type: String,
  },
  reel: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  name: {
    type: String,
    required: true,
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

module.exports = reelSchema;
