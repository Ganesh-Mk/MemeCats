const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const User = require("./models/userModel");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed: ", err));

app.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/signup", signupRouter);
app.post("/login", loginRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
