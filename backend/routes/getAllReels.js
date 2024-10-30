const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

const sortReels = (reels) => {
  return reels.sort((a, b) => {
    const totalLikesPriority = 1;
    const dailyLikesPriority = 2;
    const commentsPriority = 1.5;
    const lowEngagementLimit = 10;

    // Score based on totalLikes, dailyLikes, and comments length
    const scoreA =
      a.totalLikes * totalLikesPriority +
      a.dailyLikes * dailyLikesPriority +
      a.comments.length * commentsPriority;
    const scoreB =
      b.totalLikes * totalLikesPriority +
      b.dailyLikes * dailyLikesPriority +
      b.comments.length * commentsPriority;

    // Check if both scores are low, and prioritize lower ones randomly
    if (scoreA < lowEngagementLimit && scoreB < lowEngagementLimit) {
      return Math.random() - 0.5; // Randomly sort low engagement reels
    }

    // Sort by score
    return scoreB - scoreA; // Higher scores come first
  });
};

router.get("/getAllReels", async (req, res) => {
  const data = [
    {
      reelVideoUrl:
        "https://videos.pexels.com/video-files/7691954/7691954-uhd_1440_2732_30fps.mp4",
      dateAndTime: "2024-10-27T12:00:00Z",
      name: "John Doe",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      totalLikes: 120,
      dailyLikes: 20,
      comments: [
        {
          name: "Jane Smith",
          profileImage:
            "https://videos.pexels.com/video-files/28965622/12531382_1440_2560_30fps.mp4",
          dateAndTime: "2024-10-27T14:00:00Z",
          text: "Awesome reel!",
        },
        {
          name: "Mike Johnson",
          profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
          dateAndTime: "2024-10-27T15:30:00Z",
          text: "Great vibes!",
        },
      ],
    },
    {
      reelVideoUrl:
        "https://videos.pexels.com/video-files/5345981/5345981-hd_1920_1080_24fps.mp4",
      dateAndTime: "2024-10-27T13:00:00Z",
      name: "Emily Clark",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      totalLikes: 200,
      dailyLikes: 35,
      comments: [
        {
          name: "Alice Brown",
          profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
          dateAndTime: "2024-10-27T15:00:00Z",
          text: "Love this!",
        },
      ],
    },
    {
      reelVideoUrl:
        "https://videos.pexels.com/video-files/6568032/6568032-hd_1920_1080_30fps.mp4",
      dateAndTime: "2024-10-27T14:00:00Z",
      name: "Kitty",
      profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
      totalLikes: 300,
      dailyLikes: 50,
      comments: [
        {
          name: "Sarah King",
          profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
          dateAndTime: "2024-10-27T16:00:00Z",
          text: "Wow, this is amazing!",
        },
        {
          name: "Tom Hanks",
          profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
          dateAndTime: "2024-10-27T17:00:00Z",
          text: "Good stuff!",
        },
      ],
    },
  ];

  return res.status(200).send({ data });

  try {
    const users = await User.find().populate("reels");
    if (users) {
      let allReels = users.flatMap((user) => user.reels);
      allReels = sortReels(allReels);
      return res.status(200).send({ allReels });
    } else {
      return res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
