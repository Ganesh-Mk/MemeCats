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

module.exports = commentSchema;
