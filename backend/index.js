const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
  origin: ["http://192.168.1.6:8081"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "multipart/form-data"],
};
app.use(cors(corsOptions));
// app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const editProfileRouter = require("./routes/editProfile");
const createReelRouter = require("./routes/createReel");
const getAllReelsRouter = require("./routes/getAllReels");
const getReelRouter = require("./routes/getReel");
const deleteReelRouter = require("./routes/deleteReel");
const deleteRouter = require("./routes/delete");
const getUserRouter = require("./routes/getUser");
const updateReelLikesRouter = require("./routes/updateReelLikes");

app.use(signupRouter);
app.use(loginRouter);
app.use(editProfileRouter);
app.use(createReelRouter);
app.use(getAllReelsRouter);
app.use(getReelRouter);
app.use(deleteReelRouter);
app.use(deleteRouter);
app.use(getUserRouter);
app.use(updateReelLikesRouter);

const User = require("./models/userModel");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected: ", process.env.MONGODB_URI);
  })
  .catch((err) => console.error("Database Connection Failed: ", err));

app.get("/", async (req, res) => {
  const users = await User.find().populate("reels");
  res.json(users);
  // res.send("Hello World!");
});

app.get("/getAllReels", getAllReelsRouter);
app.get("/getReel", getReelRouter);
app.get("/delete", deleteRouter);
app.get("/getUser", getUserRouter);

app.post("/signup", signupRouter);
app.post("/login", loginRouter);
app.post("/createReel", createReelRouter);
app.post("/updateReelLikes", updateReelLikesRouter);

app.patch("/editProfile", editProfileRouter);

app.delete("/deleteReel", deleteReelRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
