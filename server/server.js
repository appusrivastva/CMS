const express = require("express");
const mongoose = require("mongoose");
const User = require("./routes/userRoute.js");
const Content = require("./routes/contentRoute.js");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: "GET, POST",
    credentials: true, // Allow cookies if necessary
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// basic api create

app.get("/", (req, res) => {
  res.send("api is running");
});
// user route

// database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch(() => {
    console.log("");
  });

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

app.use("/user", User);
app.use("/content", Content);
