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
  origin: [`${process.env.FRONTEND_URL}`],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "multipart/form-data"],
};
app.use(cors(corsOptions));
// app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const editProfileRouter = require("./routes/editProfile");
const deleteUserRouter = require("./routes/deleteUser");
const createReelRouter = require("./routes/createReel");
const getAllReelsRouter = require("./routes/getAllReels");
const getReelRouter = require("./routes/getReel");
const deleteReelRouter = require("./routes/deleteReel");
const editReelRouter = require("./routes/editReel");

app.use(signupRouter);
app.use(loginRouter);
app.use(editProfileRouter);
app.use(deleteUserRouter);
app.use(createReelRouter);
app.use(getAllReelsRouter);
app.use(getReelRouter);
app.use(deleteReelRouter);
app.use(editReelRouter);

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
});

app.get("/getAllReels", getAllReelsRouter);
app.get("/getReel", getReelRouter);

app.post("/signup", signupRouter);
app.post("/login", loginRouter);
app.post("/createReel", createReelRouter);

app.patch("/editProfile", editProfileRouter);
app.patch("/editReel", editReelRouter);

app.delete("/deleteUser", deleteUserRouter);
app.delete("/deleteReel", deleteReelRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
