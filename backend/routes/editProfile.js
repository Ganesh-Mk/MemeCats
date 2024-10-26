const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const User = require("../models/userModel");

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to use memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer({ dest: "uploads/" });

router.patch(
  "/editProfile",
  upload.single("profileImage"), // Expecting an image file with the key 'profileImage'
  async (req, res) => {
    console.log("Came to edit profile");

    const { name, email } = req.body; // Destructure name and email from the request body
    let profileImageUrl; // Variable to hold the uploaded image URL

    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);

    // If an image file is provided, upload it to Cloudinary
    if (req.file) {
      try {
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        // Create a promise to handle the upload process
        profileImageUrl = await new Promise((resolve, reject) => {
          bufferStream.pipe(
            cloudinary.uploader.upload_stream(
              { resource_type: "image" }, // Specify that the upload is an image
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload failed:", error);
                  return reject(new Error("Cloudinary upload failed")); // Reject the promise on error
                }
                console.log("Cloudinary upload successful:", result.secure_url);
                resolve(result.secure_url); // Resolve the promise with the uploaded image URL
              }
            )
          );
        });
      } catch (err) {
        console.error("Error during Cloudinary upload:", err.message);
        return res.status(500).send({ message: "Image upload failed" }); // Send error response
      }
    } else {
      console.log("No file uploaded for profileImage");
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (user) {
        console.log("User found");

        // Update user details
        if (name) user.name = name; // Update name if provided
        if (profileImageUrl) user.profileImage = profileImageUrl; // Update profile image URL if uploaded

        await user.save(); // Save changes to the user
        return res
          .status(200)
          .send({ message: "Profile updated successfully", user });
      } else {
        console.log("User not found");
        return res.status(404).send({ message: "User Not Found" }); // User not found
      }
    } catch (err) {
      console.error("Server error:", err);
      return res
        .status(500)
        .send({ message: "An error occurred: " + err.message }); // General server error
    }
  }
);

module.exports = router;
