const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "multipart/form-data"],
};
app.use(cors(corsOptions));

const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const editProfileRouter = require("./routes/editProfile");
const createReelRouter = require("./routes/createReel");
const getAllReelsRouter = require("./routes/getAllReels");
const getReelRouter = require("./routes/getReel");
const deleteReelRouter = require("./routes/deleteReel");
const getUserRouter = require("./routes/getUser");
const updateReelLikesRouter = require("./routes/updateReelLikes");
const saveReelRouter = require("./routes/saveReel");
const deleteSavedReelRouter = require("./routes/deleteSavedReel");
const getRankingRouter = require("./routes/getRanking");
const getAIResponseRouter = require("./routes/getAIResponse");
const getCommentsRouter = require("./routes/getComments");
const commentRouter = require("./routes/comment");

app.use(signupRouter);
app.use(loginRouter);
app.use(editProfileRouter);
app.use(createReelRouter);
app.use(getAllReelsRouter);
app.use(getReelRouter);
app.use(deleteReelRouter);
app.use(getUserRouter);
app.use(updateReelLikesRouter);
app.use(saveReelRouter);
app.use(deleteSavedReelRouter);
app.use(getRankingRouter);
app.use(getAIResponseRouter);
app.use(getCommentsRouter);
app.use(commentRouter);

const User = require("./models/userModel");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected ");
  })
  .catch((err) => console.error("Database Connection Failed: ", err));

app.get("/", async (req, res) => {
  const users = await User.find().populate("reels");
  res.json(users);
});

app.get("/getAllReels", getAllReelsRouter);
app.get("/getReel", getReelRouter);
app.get("/getUser", getUserRouter);
app.get("/getRanking", getRankingRouter);
app.get("/getComments", getCommentsRouter);

app.post("/signup", signupRouter);
app.post("/login", loginRouter);
app.post("/createReel", createReelRouter);
app.post("/updateReelLikes", updateReelLikesRouter);
app.post("/saveReel", saveReelRouter);
app.post("/getAIResponse", getAIResponseRouter);
app.post("/comment", commentRouter);

app.patch("/editProfile", editProfileRouter);

app.delete("/deleteReel", deleteReelRouter);
app.delete("/deleteSavedReel", deleteSavedReelRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
