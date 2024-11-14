const express = require("express");
const multer = require("multer");
const router = express.Router();
const User = require("../models/userModel");
const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Convert buffer to readable stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null); // End of stream
  return readable;
};

router.patch(
  "/editProfile",
  upload.single("profileImage"),
  async (req, res) => {
    const { name, email } = req.body;
    const profileImageFile = req.file;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send({ message: "User Not Found!" });

      if (name) user.name = name;

      if (profileImageFile) {
        // Upload image to Cloudinary using buffer converted to stream
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "profiles",
              public_id: user._id,
            },
            (error, result) => {
              if (error) {
                reject(new Error("Cloudinary upload failed"));
              } else {
                resolve(result);
              }
            }
          );

          bufferToStream(profileImageFile.buffer).pipe(uploadStream);
        });

        user.profileImage = result.secure_url; // Store the Cloudinary URL in MongoDB
      }

      await user.save();

      res.status(200).send({ message: "Edited Successfully", user });
    } catch (err) {
      console.error("Error:", err.message);
      res
        .status(500)
        .send({ message: "An error occurred", error: err.message });
    }
  }
);

module.exports = router;
