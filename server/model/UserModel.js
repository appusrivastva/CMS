const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
  },

  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  user_password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Moderator"],
    default: "User"
  },
});

const User = mongoose.model("User", userSchema)
module.exports = User;