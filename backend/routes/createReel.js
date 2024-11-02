const express = require("express");
const multer = require("multer");
const router = express.Router();
const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");
require("dotenv").config();
const Reel = require("../models/reelsModel");
const User = require("../models/userModel");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to convert buffer to readable stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null); // End of stream
  return readable;
};

// Route for creating a new reel
// Route for creating a new reel
router.post("/createReel", upload.single("videoFile"), async (req, res) => {
  console.log("Came to backend");
  const { title, description, user } = req.body; // Add user here
  const videoFile = req.file;

  try {
    if (!title || !description) {
      return res
        .status(400)
        .send({ message: "Title and description are required" });
    }

    if (!user) {
      return res.status(400).send({ message: "User is required" });
    }

    if (!videoFile) {
      return res.status(400).send({ message: "Video file is required" });
    }

    // Upload video to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "reels",
          resource_type: "video",
        },
        (error, result) => {
          if (error) {
            reject(new Error("Cloudinary upload failed"));
          } else {
            resolve(result);
          }
        }
      );

      bufferToStream(videoFile.buffer).pipe(uploadStream);
    });

    console.log("After Cloudinary upload", result);

    // Save reel data to MongoDB
    const newReel = new Reel({
      user,
      title,
      description,
      reelUrl: result.secure_url, // Updated to reelUrl
      publicId: result.public_id,
    });

    await newReel.save();

    // Save reel data to user's reels array in mongoDB
    const userDB = await User.findById(user);
    userDB.reels.push(newReel._id);
    await userDB.save();

    res.status(201).send({
      success: true,
      message: "Reel created successfully",
      reel: newReel,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send({ message: "An error occurred", error: err.message });
  }
});

module.exports = router;
